import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { getMonthNumber } from "../constants.js";


const getStatistics = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month || !getMonthNumber(month)) {
    return res.status(400).json({
      message: "Invalid month provided. Please use a valid month name.",
    });
  }

  const monthNumber = getMonthNumber(month);

  try {
    // Define the aggregation pipeline
    const stats = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber]
          }
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] },
          },
          totalSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] },
          },
          totalNotSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSaleAmount: 1,
          totalSoldItems: 1,
          totalNotSoldItems: 1,
        },
      },
    ]);

    // If no statistics were found
    if (!stats.length) {
      return res.status(200).json(new ApiResponse(200, {
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      }, "No transactions found for the selected month."));
    }

    // Respond with fetched statistics
    return res.status(200).json(new ApiResponse(200, stats[0], "Statistics fetched successfully"));
      
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, error.message || "Internal server error while fetching statistics")
    );
  }
});

export { getStatistics };
