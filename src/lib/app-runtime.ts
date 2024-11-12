import { ManagedRuntime } from "effect";
import { type Configuration, layer as webSdkLayer } from "@effect/opentelemetry/WebSdk";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const SpansExporterLive = webSdkLayer((): Configuration => {
  return {
    resource: {
      serviceName: "my-service",
    },
    spanProcessor: new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: "http://localhost:4318/v1/traces",
      }),
    ),
  };
});

export const AppRuntime = ManagedRuntime.make(SpansExporterLive);
