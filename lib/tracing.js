const { initTracer: initJaegerTracer } = require("jaeger-client");

module.exports.initTracer = (serviceName) => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: true,
      collectorEndpoint: "http://3.37.62.140:14268/api/traces",
    },
  };
  const options = {
    logger: {
      info(msg) {
        console.log("INFO ", msg);
      },
      error(msg) {
        console.log("ERROR", msg);
      },
    },
  };
  return initJaegerTracer(config, options);
};
