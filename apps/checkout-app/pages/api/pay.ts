import { NextApiRequest, NextApiResponse } from "next";

import { createMolliePayment } from "@/backend/payments/providers/mollie";
import { createOrder } from "@/backend/payments/createOrder";
import { allowCors } from "@/backend/utils";
import { PaymentProviderID } from "@/types/common";
import { createAdyenPayment } from "@/backend/payments/providers/adyen";
import { OrderFragment } from "@/graphql";
import { getOrderDetails } from "@/backend/payments/getOrderDetails";
import { Body, Response, ErrorResponse } from "@/types/api/pay";

const paymentProviders: PaymentProviderID[] = ["mollie", "adyen"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.headers.host);
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let body: Body =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // check if correct provider was passed
  if (!paymentProviders.includes(body.provider)) {
    return res
      .status(400)
      .json({ ok: false, errors: ["UNKNOWN_PROVIDER"] } as ErrorResponse);
  }

  let order: OrderFragment;
  // check if order needs to be created
  if ("checkoutId" in body) {
    const data = await createOrder(body.checkoutId, body.totalAmount);

    if ("errors" in data) {
      return res.status(400).json({
        ok: false,
        errors: data.errors,
      } as ErrorResponse);
    }

    order = data.data;
  } else if ("orderId" in body) {
    const data = await getOrderDetails(body.orderId);

    if ("errors" in data) {
      return res.status(400).json({
        ok: false,
        errors: data.errors,
      } as ErrorResponse);
    }

    order = data.data;
  } else {
    return res.status(400).json({
      ok: false,
      errors: ["MISSING_CHECKOUT_OR_ORDER_ID"],
    } as ErrorResponse);
  }

  let response: Response;

  if (body.provider === "mollie") {
    const url = await createMolliePayment(order, body.redirectUrl);

    if (url) {
      response = {
        ok: true,
        provider: "mollie",
        orderId: order.id,
        data: {
          paymentUrl: url.href,
        },
      };

      return res.status(200).json(response);
    }
  } else if (body.provider === "adyen") {
    const paymentUrl = await createAdyenPayment(order, body.redirectUrl);

    if (paymentUrl) {
      response = {
        ok: true,
        provider: "adyen",
        orderId: order.id,
        data: {
          paymentUrl,
        },
      };

      return res.status(200).json(response);
    }
  }

  res.status(400).json({ ok: false, orderId: order.id });
}

export default allowCors(handler);
