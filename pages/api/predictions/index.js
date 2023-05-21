import { NextResponse } from "next/server";
import Replicate from "replicate";
import packageData from "../../../package.json";

const replicate = new Replicate({
  auth: "r8_bUDjg52SavYLQigPI3GcnoRGond5qK33BIwnR",
  userAgent: `${packageData.name}/${packageData.version}`,
});

async function getObjectFromRequestBodyStream(body) {
  const input = await body.getReader().read();
  const decoder = new TextDecoder();
  const string = decoder.decode(input.value);
  return JSON.parse(string);
}

const WEBHOOK_HOST = "https://b9c2-120-229-69-209.ngrok-free.app"
export default async function handler(req) {
  console.log("replicate handler begin");
  console.log("prompt:",req.body.prompt)
  // https://replicate.com/rossjillian/controlnet
  const prediction = await replicate.run(
    "replicate/flan-t5-xl:7a216605843d87f5426a10d2cc6940485a232336ed04d655ef86b91e020e9210",
    {
      input: {
        prompt: req.body.prompt,
      },
      // webhook: `${WEBHOOK_HOST}/api/replicate-webhook`,
      // webhook_events_filter: ["start", "completed"],
    }
  );
  console.log("replicate handler end");
  console.log("prediction:",prediction);
  // if (prediction?.error) {
  //   return NextResponse.json({ detail: prediction.error }, { status: 500 });
  // }
  return NextResponse.json(prediction, { status: 201 });
}

