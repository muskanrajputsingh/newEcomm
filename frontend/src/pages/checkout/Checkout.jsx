import React, { useState,useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FaShoppingCart } from "react-icons/fa";
import { fetchDataFromApi ,postData} from '../../utils/api';
import './Checkout.css';
import { MyContext } from '../../App';

const Checkout = () => {
    const [countries, setCountries] = useState([]);
    const [cartData, setCartData] = useState([]); 
    const [isProcessing, setIsProcessing] = useState(false);

   const context = useContext(MyContext);

    useEffect(() => {
        fetchDataFromApi('/cart')
          .then((res) => {
            console.log("Cart Data from API:", res); // Debugging output
            if (Array.isArray(res)) {
              setCartData(res);
            } else {
              setCartData([]); 
            }
          })
          .catch(error => {
            console.error("Error fetching cart data:", error);
            setCartData([]); 
          });
      }, []);

    const [formfields,setFormfields]=useState({
        fullname:"",
        country:"INDIA",
        streetAddressLine1:"",
        streetAddressLine2:"",
        state:"",
        city:"",
        zipcode:"",
        phone:"",
        email:""
    })

    const onChangeInput=(e)=>{
        setFormfields({
            ...formfields,
            [e.target.name]:e.target.value
        })
    }

      const checkout=(e)=>{
      e.preventDefault();
      console.log(formfields);
      if(formfields.fullname===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter fullname"
        })
        return false;
      }
      if(formfields.country===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter Country"
        })
        return false;
      }
      if(formfields.streetAddressLine1===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter Street Address"
        })
        return false;
      }
      if(formfields.state===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter State"
        })
        return false;
      }
      if(formfields.city===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter City"
        })
        return false;
      }
      if(formfields.email===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter Email Address"
        })
        return false;
      }
      if(formfields.zipcode===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter Zipcode"
        })
        return false;
      }
      if(formfields.phone===""){
        context.setAlertBox({
            open:true,
            error:true,
            msg:"Please enter Phone Number"
        })
        return false;
      }

     const addressInfo={
        name:formfields.fullname,
        phone:formfields.phone,
        address:formfields.streetAddressLine1 + formfields.streetAddressLine2,
        pincode:formfields.zipcode,
        date:new Date().toLocaleString(
            "en-US",
            {
                month:"short",
                day:"2-digit",
                year:"numeric",
            }
        )
     }

      }

//   const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const handleCheckout = async (e) => {
//   e.preventDefault();

//   // Validate billing form first
//   const requiredFields = [
//     { key: "fullname", label: "Full Name" },
//     { key: "country", label: "Country" },
//     { key: "streetAddressLine1", label: "Street Address" },
//     { key: "state", label: "State" },
//     { key: "city", label: "City" },
//     { key: "zipcode", label: "Zipcode" },
//     { key: "phone", label: "Phone Number" },
//     { key: "email", label: "Email Address" },
//   ];

//   for (let field of requiredFields) {
//     if (!formfields[field.key]?.trim()) {
//       context.setAlertBox({
//         open: true,
//         error: true,
//         msg: `Please enter ${field.label}`,
//       });
//       return;
//     }
//   }

//   // Proceed only if form is valid
//   try {
//     setIsProcessing(true);

//     // Load Razorpay SDK
//     const isLoaded = await loadRazorpayScript();
//     if (!isLoaded) {
//       context.setAlertBox({
//         open: true,
//         error: true,
//         msg: "Failed to load Razorpay SDK. Check your internet connection.",
//       });
//       setIsProcessing(false);
//       return;
//     }

//     // Calculate total from cart data
//     const total = cartData.length
//       ? cartData
//           .map((item) => parseInt(item.price) * item.quantity)
//           .reduce((sum, val) => sum + val, 0)
//       : 0;

//     if (total === 0) {
//       context.setAlertBox({
//         open: true,
//         error: true,
//         msg: "Your cart is empty!",
//       });
//       setIsProcessing(false);
//       return;
//     }

//     // Create order in backend
//     const orderData = await postData("/payment/order", { amount: Math.round(total * 100) });
//     const order = orderData.data;

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Fashion Nova",
//       description: "E-commerce Payment",
//       order_id: order.id,
//       handler: async (response) => {
//         setIsProcessing(false);
//         const verifyRes = await postData("/payment/verify", {
//           razorpay_order_id: response.razorpay_order_id,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature: response.razorpay_signature,
//         });

//         if (verifyRes.message === "Payment Successful") {
//           context.setAlertBox({
//             open: true,
//             error: false,
//             msg: "Payment Successful!",
//           });
//         } else {
//           context.setAlertBox({
//             open: true,
//             error: true,
//             msg: "Payment verification failed!",
//           });
//         }
//       },
//       prefill: {
//         name: formfields.fullname,
//         email: formfields.email,
//         contact: formfields.phone,
//       },
//       theme: {
//         color: "#eddcd0",
//       },
//     };

//     const razor = new window.Razorpay(options);
//     razor.open();

//     razor.on("payment.failed", () => {
//       setIsProcessing(false);
//       context.setAlertBox({
//         open: true,
//         error: true,
//         msg: "Payment failed! Please try again.",
//       });
//     });
//   } catch (error) {
//     console.error("Error in payment:", error);
//     context.setAlertBox({
//       open: true,
//       error: true,
//       msg: "Something went wrong during checkout!",
//     });
//     setIsProcessing(false);
//   }
// };

const handleCheckout = async () => {
  try {
    const orderData = await postData("/payment/order", { amount: Math.round(total) });
    const order = orderData.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Purple Hub",
      description: "E-commerce Payment",
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await postData("/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes.message === "Payment Successful") {
          alert("✅ Payment Successful!");
        } else {
          alert("❌ Payment verification failed!");
        }
      },
      prefill: {
        name: "Muskan Singh",
        email: "muskansingh7105@gmail.com",
        contact: "9770626211",
      },
      theme: {
        color: "#f8e4f8",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Error in payment:", error);
    alert("Something went wrong during checkout!");
  }
};

  return (
    <>
      <section className='section'>
       <div className="container">
        <form className='checkoutform' onSubmit={checkout}>
        <div className="row">
            <div className="col-md-7">
                <h5 className='hd fw-800 py-2'>BILLING DETAILS</h5>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="form-group">
                        <TextField label="Full Name *" variant="outlined" className='w-100' size='small' name="fullname"
                         onChange={onChangeInput}/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                  <FormControl fullWidth className="inps">
                  <InputLabel id="country-label">Country *</InputLabel>
                  <Select
                    labelId="country-label"
                    name="country"
                    value={formfields.country}
                    onChange={onChangeInput}
                    size="small"
                  >
                    {countries.length > 0 ? (
                      countries.map((c) => (
                        <MenuItem key={c.alpha2Code} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="INDIA">INDIA</MenuItem> // default fallback
                    )}
                  </Select>
                </FormControl>

                        </div>
                    </div>

                    </div>

                   <h6>Street address *</h6> 

                   <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="form-group">
                        <TextField label="House number and Street Name" variant="outlined" className='w-100' size='small'
                       name="streetAddressLine1" onChange={onChangeInput} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                        <TextField label="Apartment,suite,flat etc.(optional)" variant="outlined" className='w-100' size='small'
                         name="streetAddressLine2" onChange={onChangeInput}/>
                        </div>
                    </div>
                   </div>

                   <h6>State *</h6> 

                        <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="form-group">
                            <TextField label="State" variant="outlined" className='w-100' size='small'  name="state" onChange={onChangeInput}/>
                            </div>
                        </div>
                        </div>

                   <h6>Town / City *</h6> 

                        <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="form-group">
                            <TextField label="City" variant="outlined" className='w-100' size='small'  name="city" onChange={onChangeInput}/>
                            </div>
                        </div>
                        </div>

                        <h6>Pincode / ZIP *</h6> 

                        <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="form-group">
                            <TextField label="PinCode" variant="outlined" className='w-100' size='small'  name="zipcode" onChange={onChangeInput}/>
                            </div>
                        </div>
                        </div>

                        <h6>Contact *</h6> 

                        <div className="row mt-4">
                        <div className="col-md-6">
                            <div className="form-group">
                            <TextField label="Phone Number" variant="outlined" className='w-100' size='small'  name="phone" onChange={onChangeInput}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                            <TextField label="Email Address" variant="outlined" className='w-100' size='small'  name="email" onChange={onChangeInput}/>
                            </div>
                        </div>
                        </div>

                    </div>

       <div className="col-md-5">
        <div className="card orderinfo">
         <h5>YOUR ORDER</h5>
         <div className="table-responsive mt-3">
            <table className='table table-borderless'>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Subtotal</th>
                </tr>
            </thead>

           <tbody>
           
           {
            cartData?.length !==0 && cartData?.map((item,index)=>{
                return(
                    <tr key={index}>
                    <td><img src={item.image} height="50px" width="50px" alt="" /></td>
                    <td>{item.productTitle} <b>&nbsp; ⤬ {item.quantity}</b></td>
                    <td> ₹ {item.price}</td>
                </tr>
                )
            })
           }

            <tr>
                <td>Subtotal</td>
                <td>Total amount to pay </td>
                <td> ₹ {
                    cartData.length!==0 && cartData.map(item=>parseInt(item.price)*item.quantity).reduce((total,value)=>
                    total+value,0)
                  }</td>
            </tr>

           </tbody>

            </table>
         </div>

        <button
          type="button"
          className="checkout-btn w-100 mt-3 flex items-center justify-center gap-2"
          onClick={handleCheckout}
          disabled={isProcessing} // disable button during processing
        >
          {isProcessing ? (
            <>
              Processing Checkout...
               <span className="spinner"></span>
            </>
          ) : (
            <>
              Checkout &nbsp;
              <FaShoppingCart className="pb-1 text-2xl" />
            </>
          )}
        </button>

        </div>
       </div>

        </div>
        </form>
       </div>
      </section>
    </>
  )
}

export default Checkout
