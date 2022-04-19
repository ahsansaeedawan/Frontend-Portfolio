import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FormikInput } from "../formikInput";
import { FormikImageUpload } from "../formikImageUpload";
import {
	addUserValidationSchema,
	editUserValidationSchema
} from "../../constants/formValidations";
import { PrimaryButton } from "../button";
import FormikCheckbox from "../formikCheckbox/formikCheckbox";
import { FormikMultiSelect } from "../formikMultiSelect";
import { UserContext } from "../../context";
import Select from 'react-select';
import classNames from "classnames";
import { getOrganization, getIntelliconUsers } from "../../api";
import { LoadingMask } from "../loadingMask";

const validationSchema = {
	add: addUserValidationSchema,
	edit: editUserValidationSchema
};

function OrganizationUserForm({
	type = "add",
	onSubmit,
	submitBtnText,
	onCancel,
	initialValues,
	options
}) {
	const [isRole, setRole] = useState(false);
	const [isIntelliconUsersAvailable, setIsIntelliconUsersAvailable] = useState(false);
	const user = useContext(UserContext);
	const [parentOrgs, setParentOrgs] = useState(null);
	const [intelliconUser, setIntelliconUser] = useState([]);
	const [isLoading, setLoading] = useState(true);

	let editFormattedData;
	if (type === "edit" && initialValues.intelliconAgent !== undefined) {
		let formatedIntelliconAgents = initialValues.intelliconAgent;
		editFormattedData = { label: formatedIntelliconAgents.username, value: { username: formatedIntelliconAgents.username, password: formatedIntelliconAgents.password } }
	}
	const getIntelliconUsersAPI = (orgId) => {
		setLoading(true);
		getIntelliconUsers({ orgId }).then(({ data }) => {
			let formattedData = []; // temp array
			data.data.map((e) => {
				formattedData.push({ label: e.username, value: [{ username: e.username, password: e.password }] })
			})
			setIntelliconUser(formattedData);
			if (data.data.length > 0 && type === "add") {
				console.log("object data", data.data,)
				setIsIntelliconUsersAvailable(false);
			} else if (data.data.length > 0 === 0 && type === "edit") {
				setIsIntelliconUsersAvailable(true);
			} else {
				setIsIntelliconUsersAvailable(true);
			}
			setLoading(false);
		})
	}


	useEffect(() => {
		if (user.role[0] !== "SUPER_ADMIN") {
			getIntelliconUsersAPI(user.organization._id);
		}

		if (user.role[0] === "SUPER_ADMIN") {
			getOrganization().then(({ data }) => {
				let formattedData = [];
				data.data.orgs.map((e) => {
					formattedData.push({ label: e.name, value: e._id })
				})
				setParentOrgs(formattedData);
				setLoading(false);
			})
			if (type === "edit") {
				getIntelliconUsersAPI(initialValues.organization);
			}

		}
		else {
			setLoading(false);
		}


	}, []);


	const validateUser = (values, type) => {
		console.log("object", values["role"][0] ?? false)
		setRole(values["role"][0] ?? false);
		console.log(isRole);
		console.log("object intelliconUser", intelliconUser)
		if (type === "add") {
			let role = values["role"][0]?.value === "RESPONSE_UNIT";
			if (role) {
				values["intelliconAgents"] = " None   "
				setIsIntelliconUsersAvailable(false);
			} else {
				console.log("object intelliconUser", intelliconUser)

				!intelliconUser && setIsIntelliconUsersAvailable(true);
				values["intelliconAgents"] = intelliconUser;
			}
		}
		else if (type === "edit") {
			let role = values["role"][0]?.value === "RESPONSE_UNIT"
			if (role) {
				values["intelliconAgents"] = "    "
				setIsIntelliconUsersAvailable(false);
			}
			else {
				setIsIntelliconUsersAvailable(true);
				values["intelliconAgents"] = intelliconUser;
			}

		}
	}
	const validateCall = (values) => {
		if (type === "edit") {
			let role = values["role"][0]?.value !== "RESPONSE_UNIT";
			if (role) {
				if (user.role[0] !== "SUPER_ADMIN") {
					getIntelliconUsersAPI(user.organization);
				}
				else {
					getIntelliconUsersAPI(initialValues.organization);
				}
			}
		}
		else if (type === "add") {
			console.log("Values are in add else if", values)
			getIntelliconUsersAPI(values.organization);

		}
	}

	const NoIntelliconUser = () => {
		return (
			<div className="form-col-container">
				<div className="form-group">
					<div className="has-error">
						<span className="form-field-error">No Intellicon User Available</span></div>
				</div>
			</div>
		);
	}

	return (
		<>
			{isLoading && <LoadingMask />}
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema[type]}
				onSubmit={onSubmit}
			>
				{({
					isSubmitting,
					errors,
					status,
					touched,
					isValid,
					dirty,
					setFieldValue,
					setFieldTouched,
					values,
					handleBlur
				}) => (


					< Form className="admin-form" noValidate>
						{
							validateUser(values, type)
						}
						{
							console.log("Errors", errors, values)
						}
						<div className="form-inputs">

							<div className="form-col-container">
								<FormikInput
									name="first_name"
									placeholder="First Name"
									errors={errors.first_name}
									touched={touched.first_name}
								/>
							</div>

							<div className="form-col-container">
								<FormikInput
									name="last_name"
									placeholder="Last Name"
									errors={errors.last_name}
									touched={touched.last_name}
								/>
							</div>

							<div className="form-col-container">
								<FormikInput
									name="email"
									type="email"
									placeholder="Email"
									errors={errors.email}
									touched={touched.email}
								/>
							</div>
							{type === "add" && (
								<div className="form-col-container">
									<div className="form-user-password">
										<FormikInput
											name="password"
											type="password"
											placeholder="Password"
											errors={errors.password}
											touched={touched.password}
											style={{
												paddingRight: "152px",
												cursor: values.emailPassword ? "no-drop" : "text"
											}}
											disabled={values.emailPassword}
										/>
										<div className="email-password-container">
											<Field
												id="emailPassword"
												name="emailPassword"
												label="Send password email"
												type="checkbox"
												checked={values.emailPassword}
												component={FormikCheckbox}
											/>
										</div>
									</div>
								</div>
							)}
							<div className="form-col-container">
								<FormikImageUpload
									name="avatar"
									errors={errors.avatar}
									touched={touched.avatar}
									onTouched={setFieldTouched}
									onValueChange={setFieldValue}
									value={values.avatar}
								/>
							</div>
							<div className="form-col-container">
								<FormikInput
									name="contact"
									placeholder="Phone"
									errors={errors.contact}
									touched={touched.contact}
								/>
							</div>
							{

								user.role[0] !== "SUPER_ADMIN" ?
									<>
										{
											values["organization"] = "0",
											null
										}
									</>
									: <div className="form-col-container">
										<div className={classNames("form-group", {
											"has-errors": errors.organization,
											valid: errors.organization
										})}>

											<Select
												className="react-multi-select "
												classNamePrefix="react-select"
												placeholder="Select Parent Rapid Response Partner "
												name="organization"
												isSearchable={false}
												options={parentOrgs}
												onBlur={handleBlur}
												onChange={(e) => {
													setLoading(true);
													setFieldValue("organization", e.value)
													getIntelliconUsersAPI(e.value);
												}
												}
												value={parentOrgs && parentOrgs.filter(data => data.value == values.organization)[0]} // input default value update
											//defaultValue={this.state.defaultDealer && this.state.defaultDealer[0]}
											/>
											{errors.organization && <span className="form-field-error">{errors.organization}</span>}
										</div>

									</div>
							}

							<div className="form-col-container">
								<FormikMultiSelect
									touched={touched.role}
									errors={errors.role}
									placeholder="Role"
									name="role"
									value={values.role}
									onValueChange={setFieldValue}
									onTouch={setFieldTouched}
									options={options}
									callApi={validateCall}
									values={values}
								/>
							</div>

							{

								isIntelliconUsersAvailable && isRole ? <NoIntelliconUser /> :
									values["role"].some((e) => (
										e.value !== "RESPONSE_UNIT"
									)) ?
										<div className="form-col-container">
											<div className={classNames("form-group", {
												"has-errors": errors.intelliconAgents,
												valid: errors.intelliconAgents
											})}>
												<Select
													className="react-multi-select "
													classNamePrefix="react-select"
													placeholder="Select Intellicon User Agent"
													name="intelliconAgents"
													isSearchable={false}
													options={intelliconUser}
													onBlur={handleBlur}
													onChange={(e) => {
														setFieldValue("intelliconAgents", e.value)
														setFieldTouched('intelliconAgents', true, false);

													}
													}
													defaultValue={type === "edit" && editFormattedData && editFormattedData.label === undefined ? false : editFormattedData}

												/>
												{intelliconUser.length > 0 && errors.intelliconAgents && <span className="form-field-error">{errors.intelliconAgents}</span>}
											</div>

										</div> : <>
											{
												values["intelliconAgents"] = "None",
												null
											}
										</>
							}



							{status && status.apiError && status.apiError.length > 0 && (
								<>
									{status.apiError.map((error, i) => (
										<div key={i} className="form-error">
											{error.message}
										</div>
									))}
								</>
							)}
							{status && status.successMessage && (
								<div className="form-success" style={{ marginTop: "20px" }}>
									{status.successMessage}
								</div>
							)}
						</div>
						<div className="form-actions">
							<PrimaryButton
								type="submit"
								title={submitBtnText}
								disabled={isSubmitting || !isValid || !dirty || !isRole || isIntelliconUsersAvailable}
							/>

							<PrimaryButton
								onClick={onCancel}
								style={{ marginLeft: "15px" }}
								title="Cancel"
							/>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}

export default OrganizationUserForm;
