import { Property } from "../Models/propertyModel.js";
import { Booking } from "../Models/bookingModel.js";

//createOrder:any property
const createOrder = async (req, res) => {
  console.log("REQUEST BODY:", req.body);
  console.log("FROM DATE:", req.body.fromDate);

  const { amount, PropertyId, fromDate, toDate, guests } = req.body;

  //orderID
  const orderId = "order_" + Date.now();
  res.json({
    success: true,
    message: "Order created Successfully",
    orderId,
    amount,
    PropertyId,
    fromDate,
    toDate,
    guests,
  });
};
//verifypayment
// 25,26
//1.save the booking
//2.Block these dates

const verifyPayment = async (req, res) => {
  const { orderId, bookingDetails, forceStatus } = req.body;
  console.log("VERIFY REQUEST BODY:", req.body);
  console.log("BOOKING DETAILS:", bookingDetails);
  console.log("PROPERTY ID:", bookingDetails?.propertyId);
  console.log("FROM DATE:", bookingDetails?.fromDate);
  console.log("TO DATE:", bookingDetails?.toDate);

  if (forceStatus == "success") {
    const paymentId = "pay_" + Date.now();

    // save booking
    const newBooking = await Booking.create({
      user: req.user._id,
      Property: bookingDetails.propertyId,
      price: bookingDetails.price,
      fromDate: bookingDetails.fromDate,
      toDate: bookingDetails.toDate,
      guests: bookingDetails.guests,
      numberOfnights: bookingDetails.nights,
      paid: true,
    });

    // tell property those dates are taken

    const updatedProperty = await Property.findByIdAndUpdate(
      bookingDetails.propertyId,
      {
        $push: {
          currentBookings: {
            bookingId: newBooking._id,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            userId: req.user._id,
          },
        },
      },

      { new: true },
    );

    res.json({
      success: true,
      message: "payment successful , booking confirmed!!",
      paymentId,
      orderId,
      Booking: newBooking,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment failed!",
      orderId,
    });
  }
};

//get my bookings
const getUserBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate
    ("Property" );

    res.status(200).json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

// get one booking details
// :id
const getBookingDetails = async (req, res) => {
  try {
    const bookings = await Booking.findById(req.params.bookingId);

    res.status(200).json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};
export { getBookingDetails, getUserBooking, createOrder, verifyPayment };
