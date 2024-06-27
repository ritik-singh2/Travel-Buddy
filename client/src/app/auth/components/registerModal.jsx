import React, {
  useState
} from 'react';
import {
  useForm
} from 'react-hook-form';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { toast } from 'react-toastify';
import APIRequests from '@/api';
import "./modal.css"
import LocationSearchInput from './location';
import Script from 'next/script';
// import dotenv from 'dotenv';
import MyMap from '@/components/map';
import { Provider } from 'react-redux';
import store from '@/redux/store';

// dotenv.config();


const RegisterModal = ({ modal, setModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();


  const toastConfig = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const [location, setLocation] = useState({});
  const registerUser = async (data) => {

    if (!location.latitude || !location.longitude) {
      toast.error("Please select a location", toastConfig)
      return;
    }
    data.location = location;
    // console.log(data);
    const response = await APIRequests.signUp(data);
    // console.log(response)
    if (response.status == 201) {
      toast.error(response.data.error, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
    else if (response.status == 200) {
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
    toggle();
  }

  const onSubmit = (data) => {
    registerUser(data);
  };

  const toggle = () => setModal(!modal);

  return (
    <>
      {modal && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GCP_API}&libraries=places`}
          strategy="beforeInteractive"
        />
      )}

      <Modal isOpen={modal} toggle={toggle} style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
      }}>
        <ModalHeader toggle={toggle}>Registration Details</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} >
            <div className='flex flex-col items-center justify-evenly gap-4 mb-2 w-full'>
              <div className='w-full' >
                <input className='w-full' type="text" placeholder="Name " {...register("name", { required: true, maxLength: 80 })} />
              </div>
              <div className='w-full' >
                <input className='w-full' type="email" placeholder="Email" {...register("email", { required: true, maxLength: 80 })} />
              </div>
              <div className='w-full' >
                <input className='w-full' type="password" placeholder="Password" {...register("password", { required: true })} />
              </div>
              <div className='w-full' >
                <input className='w-full' type="number" placeholder="Graduation Year" {...register("graduation", { required: true })} />
              </div>
              <div className='w-full' >
                <label> Branch:
                  <select className='ml-2 border-1 rounded' {...register("branch", { required: true })}>
                    <option value="Comps">Comps</option>
                    <option value=" IT"> IT</option>
                    <option value=" CSE"> CSE</option>
                    <option value=" DS"> DS</option>
                    <option value=" AIML"> AIML</option>
                    <option value=" EXTC"> EXTC</option>
                  </select>
                </label>
              </div>
              <div className='w-full' >
                <LocationSearchInput sLL={setLocation} />
                <Provider store={store}>
                  <MyMap lat={location.latitude} long={location.longitude} forReg={true} sLL={setLocation} />
                </Provider>
              </div>
            </div>
            <ModalFooter>
              <Button outline color="primary" type="submit">
                Register
              </Button>{' '}
              <Button outline color='danger' onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default RegisterModal;
