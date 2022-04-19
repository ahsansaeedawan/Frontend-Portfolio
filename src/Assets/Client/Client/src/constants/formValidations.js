import * as Yup from "yup";

export const phoneNumber = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
export const password = {
  regex: new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$"
  ),
  errorMessage:
    "Must contain 8 Characters, One Uppercase, One Number and one special case character.",
};
export const alphabetsOnly = {
  regex: new RegExp("(^[a-zA-Z ]*$)"),
  errorMessage: "Must contain only alphabets",
};

const contact = Yup.string()
  .required("Phone number is required")
  .matches(phoneNumber, "Phone number is not valid");

const email = Yup.string()
  .email("Please enter a valid email")
  .required("Email is required");

const first_name = Yup.string()
  .required("First Name is required")
  .matches(alphabetsOnly.regex, alphabetsOnly.errorMessage);
const last_name = Yup.string()
  .required("Last Name is required")
  .matches(alphabetsOnly.regex, alphabetsOnly.errorMessage);

const voip_username = Yup.string().max(25, "Maximum length exceeded");

const role = Yup.array().required("Role is required");
const avatar = Yup.mixed().required("Image is required");


const organization = Yup.string().required("Parent Organization is Required");

const intelliconAgents = Yup.string().required("Intellicon Agent is Required");

export const organizationValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(alphabetsOnly.regex, alphabetsOnly.errorMessage),
  contact,
  person: Yup.string()
    .required("Contact Person is required")
    .matches(alphabetsOnly.regex, alphabetsOnly.errorMessage),
  address: Yup.string().required("Address is required"),
  email,
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  dealerId: Yup.string().required("Dealer is required"),//After 02 15 2021 realese dealer subdealer conecpt are 
  subDealerId: Yup.string().required("Subdealer is required"),//remove from our project so remove or comment these lines
  parent: Yup.string().required("Parent Org is required"),
  zoom: Yup.string().required("Please use the map to set zoom"),
  lat: Yup.string().required("Please use the map to set Latitude"),
  lng: Yup.string().required("Please use the map to set Longitude"),
  logo: Yup.mixed().required("Logo is required"),
  customerSatisfaction: Yup.number().required("Must be zero or greater"),
  delayTime: Yup.number().required("Must be zero or greater"),
  serviceUpTime: Yup.number().required("Must be zero or greater"),
  verificationTime: Yup.number().required("Must be Required").min(120, "Minimum length exceeded").max(240, "Maximum length exceeded"),
  acknowledgmentTime: Yup.number().required("Must be Required").min(60, "Minimum length exceeded").max(120, "Maximum length exceeded"),
  responseUnitAssignmentTime: Yup.number().required("Must be Required").min(60, "Minimum length exceeded").max(180, "Maximum length exceeded"),
  // responseUnitAcknowledgmentTime: Yup.number().required("Must be zero or greater"),
  responseUnitArrivalTime: Yup.number().required("Must be Required").min(15, "Minimum length exceeded").max(30, "Maximum length exceeded"),
  localAuthoritiesEngagementTime: Yup.number().required("Must be Required").min(60, "Minimum length exceeded").max(240, "Maximum length exceeded"),
  intimatingLocalAuthoritiesEngagementTime: Yup.number().required("Must be Required").min(0, "Minimum length exceeded").max(60, "Maximum length exceeded"),
  intelliconUsername: Yup.string().required("Intellicon Username is required"),
  intelliconPassword: Yup.string().required("Intellicon Password is required"),
});

export const addUserValidationSchema = Yup.object().shape({

  first_name,
  last_name,
  voip_username,
  role,
  email,
  contact,
  avatar,
  organization,
  //intelliconAgents,
  emailPassword: Yup.boolean().notRequired(),
  password: Yup.string().when("emailPassword", {
    is: (emailPassword) => !Boolean(emailPassword),
    then: Yup.string()
      .required("Password is required.")
      .matches(password.regex, password.errorMessage),
  }),

});

export const editUserValidationSchema = Yup.object().shape({
  first_name,
  last_name,
  voip_username,
  role,
  email,
  contact,
  avatar,
  organization,
  //intelliconAgents

});

export const changePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required.")
    .matches(password.regex, password.errorMessage),
  newPassword: Yup.string()
    .required("Password is required.")
    .matches(password.regex, password.errorMessage)
    .notOneOf(
      [Yup.ref("currentPassword"), null],
      "Current and New password should not be same."
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm Password is required.")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});



export const loginFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email")
    .required("Email is required."),
  password: Yup.string()
    .required("Password is required.")
    .min(8)
});