import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const getProducts = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const searchCriteria = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ],
  };

  // Check if search parameter is provided
  if (search) {
    const numericSearch = parseFloat(search);
    const isNumeric = !isNaN(numericSearch);

    if (isNumeric) {
      // If it's numeric, add a criteria for the price field
      searchCriteria.$or.push(
        { price: numericSearch } // Exact match for price
      );
    }
  }

  try {
    // Define the aggregation pipeline
    const productAggregate = Product.aggregate([
      {
        $match: searchCriteria,
      },
    ]);

    const options = {
      page,
      limit,
    };

    // Execute aggregation with pagination
    const result = await Product.aggregatePaginate(productAggregate, options);

    // Handle case when no documents are found
    if (result?.documents?.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No products found"));
    }

    // Respond with fetched documents
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Products fetched successfully"));
  } catch (error) {
    
    // Handle errors in aggregation pagination
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message ||
            "Internal server error in product aggregate paginate"
        )
      );
  }
});

export { getProducts };
