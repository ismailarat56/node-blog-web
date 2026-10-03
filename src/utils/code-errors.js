export function describeCodeError(error) {
  if (error.code === "INVALID_VERIFICATION_CODE") {
    return "Kod hatalı veya süresi dolmuş. Gerekirse yeni kod iste.";
  }

  if (error.code === "INVALID_VERIFICATION_CODE_FORMAT") {
    return "Kod 6 haneli olmalı.";
  }

  if (error.code === "VERIFICATION_CODE_COOLDOWN") {
    return `Yeni kod istemeden önce ${error.retryAfter ?? 60} saniye bekle.`;
  }

  if (error.code === "RATE_LIMITED") {
    const minutes = Math.ceil((error.retryAfter ?? 60) / 60);

    return `Çok fazla deneme yaptın. ${minutes} dakika sonra tekrar dene.`;
  }

  return error.message;
}
