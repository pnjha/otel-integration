"use strict";

const {
  MeterProvider,
  PeriodicExportingMetricReader
} = require("@opentelemetry/sdk-metrics-base");
const { Resource } = require("@opentelemetry/resources");
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
// const {
//   OTLPMetricExporter
// } = require("@opentelemetry/exporter-metrics-otlp-http");
const {
  OTLPMetricExporter
} = require("@opentelemetry/exporter-metrics-otlp-grpc");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

// url: "http://100.66.177.133:4317/v1/metrics",
// url: "http://0.0.0.0:4317",

const tags = { name: "postgresql" };
const collectorOptions = {
  url: process.env.COLLECTOR_ENDPOINT,
  timeoutMillis: 3000
};
const metricExporter = new OTLPMetricExporter(collectorOptions);
const meterProvider = new MeterProvider({ resource: new Resource(tags) });
meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000
  })
);
const meter = meterProvider.getMeter("test_meter");
const counter = meter.createCounter("test_counter");
const updowncounter = meter.createUpDownCounter("test_updowncounter");
const histogram = meter.createHistogram("test_histogram");
setInterval(() => {
  counter.add(Math.random() * 10);
  updowncounter.add(-10 + Math.random() * 20);
  histogram.record(Math.random() * 20);
}, 3000);
