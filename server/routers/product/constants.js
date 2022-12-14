const { Product } = require("../../models/models");
const { map } = require("lodash");

const queryProducts = (req) => {
  const {
    product: productFilter,
    categories,
    subcategories,
    tradetypes,
    regions,
    districts,
    user,
    name,
    organization,
  } = req.body;
  let query = {};
  if (organization) {
    query.organization = organization;
  }
  if (tradetypes && tradetypes.length > 0) {
    query.tradetypes = { $in: tradetypes };
  }
  if (districts && districts.length) {
    query.district = { $in: districts };
  }
  if (regions && regions.length) {
    query.region = { $in: regions };
  }
  if (categories && categories.length) {
    query.categories = { $in: categories };
  }
  if (subcategories && subcategories.length) {
    query.subcategories = { $in: subcategories };
  }
  if (productFilter && productFilter === "my") {
    query.user = user;
  }
  if (name && name.length > 0) {
    query.name = new RegExp(".*" + name + ".*", "i");
  }

  return query;
};

const getProduct = async (id) =>
  await Product.findById(id)
    .populate("region", "name")
    .populate("district", "name")
    .populate("categories", "name")
    .populate("subcategories", "name")
    .populate("tradetypes", "name")
    .populate("user", "firstname lastname phone email")
    .populate("organization", "name phone email");

const getProducts = async ({ page, count, query }) =>
  await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(page * count)
    .limit(count)
    .select("-updatedAt -__v")
    .populate("region", "name")
    .populate("district", "name")
    .populate("categories", "name")
    .populate("subcategories", "name")
    .populate("tradetypes", "name")
    .populate("user", "firstname lastname phone email")
    .populate("organization", "name phone email");

const getProductsCount = async ({ query }) => await Product.find(query).count();

const getProductWithId = async (id) =>
  await Product.findById(id)
    .populate({
      path: "region",
      select: "name",
      populate: {
        path: "districts",
        select: "name",
      },
    })
    .populate("district", "name")
    .populate({
      path: "categories",
      select: "name",
      populate: {
        path: "subcategories",
        select: "name",
      },
    })
    .populate("subcategories", "name")
    .populate("user", "firstname lastname phone email")
    .populate("organization", "name phone email")
    .then((product) => {
      return {
        _id: product?._id,
        name: product?.name,
        description: product?.description,
        images: product?.images,
        minPrice: product?.minPrice,
        maxPrice: product?.maxPrice,
        currency: product?.currency,
        position: product?.position,
        tradetypes: product?.tradetypes,
        status: product?.status,
        district: {
          label: product?.district?.name,
          value: product?.district?._id,
        },
        region: {
          label: product?.region?.name,
          value: product?.region?._id,
          districts: map(product?.region?.districts, (district) => {
            return { label: district.name, value: district._id };
          }),
        },
        categories: map(product?.categories, (category) => {
          return {
            label: category.name,
            value: category._id,
            subcategories: map(category?.subcategories, (subcategory) => {
              return { label: subcategory.name, value: subcategory._id };
            }),
          };
        }),
        subcategories: map(product?.subcategories, (subcategory) => {
          return { label: subcategory.name, value: subcategory._id };
        }),
      };
    });

const getProductForUpdate = async (id) =>
  await Product.findById(id)
    .select("-updatedAt -__v")
    .populate("region", "name")
    .populate("district", "name")
    .populate("categories", "name")
    .populate("subcategories", "name")
    .populate("tradetypes", "name")
    .populate("user", "firstname lastname phone email")
    .populate("organization", "name phone email");

const getProductForOffer = async (id) =>
  await Product.findById(id)
    .populate({
      path: "region",
      select: "name",
    })
    .populate("district", "name")
    .populate({
      path: "categories",
      select: "name",
    })
    .populate("subcategories", "name")
    .populate("tradetypes", "name")
    .populate("user", "firstname lastname phone email")
    .populate("organization", "name phone email");

module.exports = {
  getProduct,
  getProductWithId,
  getProducts,
  getProductForUpdate,
  getProductForOffer,
  getProductsCount,
  queryProducts,
};
