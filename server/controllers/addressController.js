import Address from "../models/Address.js";


// Add Address : /api/address/add
export const addAddress = async(req, res)=>{
    try {
        const userId  = req.userId;
        const { firstname , lastname, email, street, city,state, zipcode, country, phone } = req.body;

        if (!firstname || !lastname){
            return res.status(400).json({success: false, message: "First and Last name are required"});
        }

            const newAddress = new Address({
                firstname,
                lastname,
                email,
                street,
                city,
                state,
                zipcode,
                country,
                phone,
                userId
            });
            await newAddress.save();
            res.json({success: true, message: "Address added successfully", address: newAddress});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
};

// Get Address : /api/address/get
export const getAddress = async(req, res)=>{
    try {
        const userId  = req.userId;
        const addresses = await Address.find({userId});
        res.json({success: true, addresses});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
};