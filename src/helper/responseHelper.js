export const send = (res, response, data = {}) => {
  const { code, message } = response;

  return res.send({
    responseCode: code,
    responseMessage: message,
    responseData: data,
  });
};

export const setErrMsg = (res, parameter) => {
  return {
    code: res.code,
    message: `${parameter} ${res.message}`,
  };
};
