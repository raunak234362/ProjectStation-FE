import React from 'react'

const AllInvoice = () => {

    const fabricators = useSelector(
      (state) => state?.fabricatorData?.fabricatorData
    );

    const getAllInvoice = async () => {
        try {
            const response = await Service.AllInvoice()
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div>AllInvoice</div>
  )
}

export default AllInvoice