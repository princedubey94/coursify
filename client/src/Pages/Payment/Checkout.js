import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../Redux/razorpaySlice";
import {getUserData} from "../../Redux/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);
  const userData = useSelector((state) => state.auth.data);
  let isPaymentVerified  = false;
  const razorPayKey = useSelector((state) => state.razorpay.key);
  const subscription_id = useSelector(
    (state) => state.razorpay.subscription_id
  );
  // for storing the payment details after successfull transaction
  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  };
  console.log("key-",razorPayKey,"id-",subscription_id)
  const handleSubscription = async (event) => {
    event.preventDefault();
    // checking for empty payment credential
    console.log("key-",razorPayKey,"id-",subscription_id)
    if (!razorPayKey || !subscription_id) {
      return;
    }

    const options = {
      key: razorPayKey,
      subscription_id: subscription_id,
      name: "Coursify Pvt. Ltd.",
      description: "Monthly Subscription",
      handler: async function (response) {
        paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
        paymentDetails.razorpay_subscription_id =
        response.razorpay_subscription_id;
        paymentDetails.razorpay_signature = response.razorpay_signature;

        // displaying the success message
        toast.success("Payment Successfull");

        // verifying the payment
        const res = await dispatch(verifyUserPayment(paymentDetails));
        const res2=await dispatch(getUserData());
        console.log(res)

        // redirecting the user according to the verification status
        isPaymentVerified=res?.payload?.success
        console.log("mh",isPaymentVerified);
        isPaymentVerified
          ? navigate("/checkout/success")
          : navigate("/checkout/fail");
      },
      prefill: {
        name: userData.fullName,
        email: userData.email,
      },
      theme: {
        color: "#F37254",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  useEffect(() => {
    (async () => {
      await dispatch(getRazorPayId());
      await dispatch(purchaseCourseBundle());
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      {/* checkout page container */}
      <form
        onSubmit={handleSubscription}
        className="min-h-[90vh] flex items-center justify-center text-white"
      >
        {/* checkout card */}
        <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
          <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
            Subscription Bundle
          </h1>

          <div className="px-4 space-y-5 text-center">
            <p className="text-[17px]">
              This purchase will allow you to access all the available courses
              of our platform for{" "}
              <span className="text-yellow-500 font-bold">1 Year Duration</span>
              . <br />
              All the existing and new launched courses will be available to you
              in this subscription bundle
            </p>

            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
              <BiRupee /> <span>499</span>only
            </p>

            <div className="text-gray-200">
              <p>100% refund at cancellation</p>
              <p>* Terms & Condition Applied</p>
            </div>
          </div>
          {loading? <img className="w-full h-10 animate-spin ml-3 mt-10 absolute bottom-4" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"></img>:
          <button
            type="submit"
            hidden={loading}
            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full text-center py-2 text-xl font-bold rounded-bl-lg rounded-br-lg"
          >
            Buy Now
          </button>}
        </div>
      </form>
    </Layout>
  );
};

export default Checkout;
