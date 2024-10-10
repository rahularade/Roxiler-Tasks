import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import axios from "axios";

const initilizeProduct = asyncHandler( async (req, res) => {
    // Fetch data from the third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    if (!data) {
        throw new ApiError(500, "data from the third-party API is empty")
    }

    await Product.deleteMany();
    const product = await Product.create(data)

    if (!product) {
        throw new ApiError(500, "Something went wrong while initializing the database")
    }

    res.status(201).json(
        new ApiResponse(200, {}, "Database initialized successfully")
    )
})

export { initilizeProduct }