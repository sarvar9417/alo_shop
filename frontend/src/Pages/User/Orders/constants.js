export const checkRegisterOrder = ({
  tradetypes,
  categories,
  subcategories,
  name,
  // status,
  minPrice,
  maxPrice,
  currency,
  setErrors,
  description,
  region,
  district,
}) => {
  const min = Number(minPrice);
  const max = Number(maxPrice);
  if (tradetypes.length === 0) {
    setErrors("Savdo turlari tanlanmagan");
    return false;
  }
  if (categories.length === 0) {
    setErrors("Kategoriyalar tanlanmagan");
    return false;
  }
  if (subcategories.length === 0) {
    setErrors("Kategoriyalar turlari tanlanmagan");
    return false;
  }
  if (name.length === 0) {
    setErrors("Mahsulot nomi kiritilmagan");
    return false;
  }

  if (description.length === 0) {
    setErrors("Mahsulot haqida ma'lumot kiritilmagan");
    return false;
  }

  if (!region) {
    setErrors("Viloyat tanlanmagan");
    return false;
  }

  if (!district) {
    setErrors("Tuman tanlanmagan");
    return false;
  }
  // if (status.length === 0) {
  //   setErrors("Mahsulot holati tanlanmagan");
  //   return false;
  // }

  if ((min || max) && min > max) {
    setErrors("Narxlar to'g'ri kiritilmagan");
    return false;
  }
  if ((min || max) && (min < 0 || max < 0)) {
    setErrors("Narxlar to'g'ri kiritilmagan");
    return false;
  }

  if ((min > 0 || max > 0) && currency === null) {
    setErrors("Valyuta tanlanmagan");
    return false;
  }

  return true;
};

export const filter = (t) => [
  {
    label: t("barcha buyurtmalar"),
    value: "all",
  },
  {
    label: t("mening buyurtmalarim"),
    value: "my",
  },
];
