const Category = require("../models/category.model");
const Product = require("../models/product.model");

function mergeProducts(p_root, p_temp) {
  let products = [];
  for (let r of p_root) {
    for (let t of p_temp) {
      if (r.title === t.title) {
        products.push(r);
      }
    }
  }
  return products;
}

async function getAllProducts(req, res, next) {
  try {
    const categories = await Category.findAll();
    const products = await Product.findAll();
    res.render("customer/products/all-products", {
      categories: categories,
      products: products,
    });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const categories = await Category.findAll();
    const name = req.body.search || "";
    const cateID = req.body.cateID;
    const price = req.body.price;
    let products = await Product.findAll();
    if (name !== "") {
      products = mergeProducts(products, await Product.findByName(name));
    }
    if (cateID !== "all") {
      products = mergeProducts(products, await Product.findByCateId(cateID));
    }
    if (price === "cheap") {
      products = mergeProducts(products, await Product.findLowerPrice(100000));
    } else if (price === "expensive") {
      products = mergeProducts(
        products,
        await Product.findGreaterPrice(500000)
      );
    } else if (price === "medium") {
      products = mergeProducts(
        products,
        await Product.findInPriceRange(100000, 500000)
      );
    }

    res.render("customer/products/all-products", {
      categories: categories,
      products: products,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("customer/products/product-details", { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProducts: getProducts,
  getProductDetails: getProductDetails,
};
