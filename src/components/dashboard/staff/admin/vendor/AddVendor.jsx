import { City, State } from 'country-state-city'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Input, Button, CustomSelect } from '../../../../index'
import Service from '../../../../../config/Service'
import { addVendor } from '../../../../../store/vendorSlice'

const AddVendor = () => {
  const token = sessionStorage.getItem('Token')
  const dispatch = useDispatch()
  // console.log(projectData)
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const country = watch('country')
  const state = watch('state')
  const [stateList, setStateList] = useState([
    {
      label: 'Select State',
      value: '',
    },
  ])

  const [cityList, setCityList] = useState([
    {
      label: 'Select City',
      value: '',
    },
  ])

  const countryList = {
    'United States': 'US',
    Canada: 'CA',
    India: 'IN',
  }
  useEffect(() => {
    const stateListObject = {}
    State.getStatesOfCountry(countryList[country])?.forEach((state1) => {
      stateListObject[state1.name] = state1.isoCode
    })
    setStateList(stateListObject)
  }, [country])

  useEffect(() => {
    setCityList(
      City.getCitiesOfState(countryList[country], stateList[state])?.map(
        (city) => ({
          label: city?.name,
          value: city?.name,
        }),
      ),
    )
  }, [state])

  const AddVendor = async (data) => {
    const vendorData = await Service.addVendor(data, token)
    if (vendorData.status === 201)
      dispatch(addVendor(vendorData.data))
    else
      console.log(vendorData.data.message)
  }

  return (
    <div className="flex w-full justify-center text-black my-5">
      <div className="h-full w-full overflow-y-auto md:px-10 px-2 py-3">
        <form onSubmit={handleSubmit(AddVendor)}>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Add Vendor:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full">
              <Input
                label="Company Name:"
                name='name'
                placeholder="Company Name"
                size="lg"
                color="blue"
                {...register('name', { required: true })}
              />
              {errors.name && <div>This field is required</div>}
            </div>
          </div>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Location:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full my-2">
              <Input
                label="Address:"
                placeholder="Address"
                size="lg"
                color="blue"
                {...register('address')}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Country: "
                placeholder="Country"
                className="w-full"
                options={[
                  { label: 'Select Country', value: '' },
                  ...Object.keys(countryList).map((country) => ({
                    label: country,
                    value: country,
                  })),
                ]}
                {...register('country', { required: 'Country is required' })}
                onChange={setValue}
              />
              {errors.country && (
                <p className="text-red-600">{errors.country.message}</p>
              )}
            </div>
            <div className="my-2">
              <CustomSelect
                label="State: "
                placeholder="State"
                className="w-full"
                options={[
                  { label: 'Select State', value: '' },
                  ...Object.keys(stateList).map((state1) => ({
                    label: state1,
                    value: state1,
                  })),
                ]}
                {...register('state', { required: true })}
                onChange={setValue}
              />
              {/* {errors.state && (
                <p className="text-red-600">{errors.state.message}</p>
              )} */}
            </div>
            <div className="my-2">
              <CustomSelect
                label="City: "
                placeholder="City"
                className="w-full"
                options={[{ label: 'Select City', value: '' }, ...cityList]}
                {...register('city', { required: true })}
                onChange={setValue}
              />
              {errors.city && (
                <p className="text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="my-2">
              <Input
                label="Zipcode: "
                placeholder="Zipcode"
                className="w-full"
                {...register('zip_code', { required: true })}
              />
              {errors.zip_code && (
                <p className="text-red-600">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div className="my-5 w-full">
            <Button type="submit" className="w-full">
              Add Vendor
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddVendor
