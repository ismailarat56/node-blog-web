const EMAIL_TAKEN = {
  field: "email",
  message:
    "Bu e-posta başka bir hesapta. Silinmiş bir hesaba ait olabilir.",
};

export const USER_FIELD_ERRORS = {
  INVALID_NAME: {
    field: "name",
    message: "Ad 2 ile 100 karakter arasında olmalı.",
  },
  INVALID_EMAIL: {
    field: "email",
    message: "Geçerli bir e-posta adresi gir.",
  },
  EMAIL_ALREADY_EXISTS: EMAIL_TAKEN,
  DUPLICATE_VALUE: EMAIL_TAKEN,
  INVALID_PASSWORD: {
    field: "password",
    message: "Parola 15 ile 128 karakter arasında olmalı.",
  },
};

export const EMPTY_USER = {
  name: "",
  email: "",
  password: "",
};

export function toUserFormValues(user) {
  return {
    name: user.name,
    email: user.email,
  };
}
