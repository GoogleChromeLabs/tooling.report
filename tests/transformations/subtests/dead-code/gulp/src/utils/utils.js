function logCaps(msg) {
  console.log(msg.toUpperCase());
}

function thisIsNeverCalledEither(msg) {
  return msg + '!';
}

exports.logCaps = logCaps;
exports.thisIsNeverCalledEither = thisIsNeverCalledEither;
