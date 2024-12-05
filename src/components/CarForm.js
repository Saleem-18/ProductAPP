import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

const apiBaseUrl = process.env.REACT_APP_API_URL;

const CarForm = () => {
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState("");

  const initialValues = {
    model: "",
    price: "",
    phone: "",
    city: "",
    maxPictures: 1,
  };

  const validationSchema = Yup.object({
    model: Yup.string().required("Car model is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    phone: Yup.string().required("Phone number is required"),
    city: Yup.string().required("City is required"),
    maxPictures: Yup.number()
      .required("Max number of pictures is required")
      .min(1, "At least 1 picture")
      .max(10, "No more than 10 pictures"),
  });

  const handleFileChange = (e, maxPictures) => {
    const selectedFiles = [...e.target.files];
    if (selectedFiles.length > maxPictures) {
      setError(`You can only upload up to ${maxPictures} pictures.`);
    } else {
      setPictures(selectedFiles);
      setError("");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("model", values.model);
    formData.append("price", values.price);
    formData.append("phone", values.phone);
    formData.append("city", values.city);
    formData.append("maxPictures", values.maxPictures);
    pictures.forEach((picture) => {
      formData.append("images", picture);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`https://de-sol-mern-backend.vercel.app/api/cars/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Car information submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      resetForm();
      setPictures([]);
    } catch (err) {
      console.error(err);
      setError("Submission failed");
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        style={{
          width: "100%",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Submit Car Information
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                label="Car Model"
                name="model"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="model" />}
                error={touched.model && !!errors.model}
              />
              <Field
                as={TextField}
                label="Price"
                name="price"
                type="number"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="price" />}
                error={touched.price && !!errors.price}
              />
              <Field name="phone">
                {({ field }) => (
                  <PhoneInput
                    {...field}
                    country={"us"}
                    value={values.phone}
                    onChange={(phone) => setFieldValue("phone", phone)}
                    inputStyle={{ width: "100%" }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="phone"
                component="div"
                style={{ color: "red" }}
              />
              <Field
                as={TextField}
                label="City"
                name="city"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="city" />}
                error={touched.city && !!errors.city}
              />
              <Field
                as={TextField}
                label="Max Number of Pictures"
                name="maxPictures"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 10 }}
                helperText={<ErrorMessage name="maxPictures" />}
                error={touched.maxPictures && !!errors.maxPictures}
              />
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, values.maxPictures)}
                accept="image/*"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "20px" }}
                disabled={pictures.length !== values.maxPictures}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          {Array.from(pictures).map((picture) => (
            <Grid item key={picture.name}>
              <img
                src={URL.createObjectURL(picture)}
                alt={`preview ${picture.name}`}
                width={100}
                height={100}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CarForm;
