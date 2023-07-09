import { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

import { FloatingLabelInput } from "~/components/FloatingLabelInput";

import { UpdateProfileContent } from "../components";
import { PageName, UserUpdateProfileApi } from "../store";
import { Spinner } from "~/components/spinner";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import { useGetProfileDataQuery } from "~/features/dashboard/store";

const createOption = (label: string) => ({
	label,
	value: label
});

// eslint-disable-next-line
function BusinessProfile() {
	const { isLoading, data, refetch, isFetching } = UserUpdateProfileApi.useGetProfileQuery(PageName.BusinessProfile);
	const [updateProfile, option] = UserUpdateProfileApi.useUpdateProfileMutation();
	const businessManager = UserUpdateProfileApi.useGetBusinessManagerQuery();
	const industryInfo = UserUpdateProfileApi.useGetIndustryInfoQuery();
	const getCadApplicationList = UserUpdateProfileApi.useGetCadApplicationListQuery();
	const countryList = UserUpdateProfileApi.useGetCountryListQuery();
	const groups = UserUpdateProfileApi.useGetUserGroupsQuery();
	const { UserId } = getLoggedUser();
	const ProfileData = useGetProfileDataQuery(UserId);
	const [getStateList, getStateListOption] = UserUpdateProfileApi.useGetCountryStateListMutation();

	const [inputValue, setInputValue] = useState("");
	const [value, setValue] = useState<any>([]);
	const [CountryValue, setCountryValue] = useState<any>({});

	const { register, handleSubmit, control, reset, setValue: setFormValue, formState } = useForm();
	const { errors } = formState;

	const onSubmit = (body: any) => {
		const requestPayload = {
			...body,
			BusinessManager: +body?.BusinessManager?.UserId || 0,
			WorkIndustry: body.WorkIndustry?.ID || 0,
			Country: body?.Country?.CountryCode || "",
			FavCADApplication: body.FavCADApplication?.ID,
			Interests: value?.map((v: any) => v.value).join(","),
			State: body?.State?.Name || body?.State,
			UserID: UserId
		};
		updateProfile({ pageName: PageName.BusinessProfile, body: requestPayload });
		setTimeout(() => {
			ProfileData.refetch();
		}, 500);
	};

	useEffect(() => {
		if (data?.Data && data?.Data?.Interests !== "") {
			const Intrests = data?.Data?.Interests?.split(",").map((v: string) => createOption(v));
			setValue(Intrests);
		}
		// eslint-disable-next-line
	}, [data]);

	useEffect(() => {
		if (data?.Data) {
			const business = businessManager.data?.Data.find(
				(manager: any) => data?.Data.BusinessManager === +manager.UserId
			);
			const industry = industryInfo.data?.Data.find((industry: any) => data?.Data?.WorkIndustry === industry.ID);
			const catApp = getCadApplicationList.data?.Data.find(
				(cat: any) => data?.Data?.FavCADApplication === cat.ID
			);
			const Country = countryList.data?.Data.find((con: any) => data?.Data?.Country === con.CountryCode);
			setCountryValue(Country);
			let State = data?.Data?.State;

			if (CountryValue?.id) {
				getStateList({ regionId: CountryValue?.id })
					.unwrap()
					.then((resp: any) => {
						if (resp?.Data?.length) {
							State = resp?.Data.find((st: any) => data?.Data?.State === st.Name);
						}
						reset({
							...data?.Data,
							BusinessManager: business,
							WorkIndustry: industry,
							FavCADApplication: catApp,
							Country,
							State
						});
					});
			}
		}
		// eslint-disable-next-line
	}, [data, isFetching, industryInfo.data, businessManager.data, getCadApplicationList.data, countryList.data]);

	const handleKeyDown = (event: any) => {
		if (!inputValue) return;
		switch (event.key) {
			case "Enter":
			case "Tab":
				setValue((prev: any) => [...prev, createOption(inputValue)]);
				setInputValue("");
				event.preventDefault();
		}
	};

	return (
		<UpdateProfileContent
			onSave={handleSubmit(onSubmit)}
			onCancel={() => refetch()}
			title="Business Profile"
			isLoading={isLoading || option.isLoading || getStateListOption.isLoading}
		>
			<h6 className="mb-3 font-semibold text-[#475569]">General Information</h6>
			<div className="mt-4 space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FloatingLabelInput name="Company" register={register("Company")} />
					<FloatingLabelInput name="Business Site" register={register("BusinessSite")} />
				</div>
				<div className="hidden grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FloatingLabelInput name="Business Group" register={register("BusinessGroup")} />
					<FloatingLabelInput name="Region" register={register("Region")} />
				</div>
				{checkIsB2B() && (
					<label className="block space-y-2">
						<span className="text-sm">Interests</span>
						<CreatableSelect
							components={{ DropdownIndicator: null }}
							inputValue={inputValue}
							isClearable
							isMulti
							menuIsOpen={false}
							onChange={newValue => setValue(newValue)}
							onInputChange={newValue => setInputValue(newValue)}
							onKeyDown={handleKeyDown}
							placeholder="Type Interests and press enter..."
							value={value}
						/>
					</label>
				)}
				{checkIsB2B() && (
					<>
						<label className="block space-y-2">
							<span className="text-sm">Belongs To</span>
							{groups.isLoading && <Spinner size={6} />}
							{groups.data?.Data && (
								<div className="flex gap-3 flex-wrap">
									{groups.data?.Data?.map((group: any) => (
										<span
											key={group.GroupID}
											className="btn bg-primary/20 text-xs rounded-full font-medium text-primary"
										>
											{group.GroupName}
										</span>
									))}
								</div>
							)}
						</label>

						<label className="block">
							<span>Business Manager</span>
							<Controller
								name="BusinessManager"
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										maxMenuHeight={150}
										menuPosition="fixed"
										options={businessManager.data?.Data}
										getOptionLabel={(option: any) => `${option.FirstName} ${option.LastName}`}
										getOptionValue={(option: any) => option.UserId}
										isLoading={businessManager.isLoading}
										className="mt-1.5"
									/>
								)}
							/>
						</label>
					</>
				)}
			</div>
			<div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
			<h6 className="mb-3 font-semibold text-[#475569]">Contact Information</h6>
			<div className="mt-4 space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="w-full">
						<FloatingLabelInput
							name="Work Email"
							register={register("Workemail", {
								required: true,
								pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
							})}
						/>
						{errors.Workemail && (
							<span className="text-red-500 text-xs ml-2">Please Enter vaild Workemail</span>
						)}
					</div>
					<div className="w-full">
						<FloatingLabelInput name="Phone" register={register("Phone", { required: true })} />
						{errors.Phone && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</div>
				</div>
				<div className="w-full">
					<FloatingLabelInput name="Address line 1" register={register("Address1", { required: true })} />
					{errors.Address1 && <span className="text-red-500 text-xs ml-2">This field is required</span>}
				</div>
				<div className="w-full">
					<FloatingLabelInput name="Address line 2" register={register("Address2", { required: true })} />
					{errors.Address2 && <span className="text-red-500 text-xs ml-2">This field is required</span>}
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="block">
						<span>Country</span>
						<Controller
							name="Country"
							control={control}
							rules={{ required: true }}
							render={({ field: { onChange, value, ...restField } }) => (
								<Select
									{...restField}
									maxMenuHeight={150}
									menuPosition="fixed"
									value={value}
									options={countryList.data?.Data}
									getOptionLabel={(option: any) => option.CountryName}
									getOptionValue={(option: any) => option.id}
									isLoading={countryList.isLoading}
									className="mt-1.5"
									onChange={option => {
										onChange(option);
										setFormValue("State", "");
										getStateList({ regionId: option.id });
										setCountryValue(option);
									}}
								/>
							)}
						/>
						{errors.Country && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</label>
					<label className="block">
						{getStateListOption.data?.Data.length === 0 && (
							<FloatingLabelInput register={register("State", { required: true })} />
						)}
						{(getStateListOption.isLoading || getStateListOption.data?.Data.length !== 0) && (
							<>
								<span>State</span>
								<Controller
									name="State"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Select
											{...field}
											maxMenuHeight={150}
											menuPosition="fixed"
											options={getStateListOption.data?.Data}
											getOptionLabel={(option: any) => option.Name}
											getOptionValue={(option: any) => option.StateID}
											isLoading={getStateListOption.isLoading}
											className="mt-1.5"
										/>
									)}
								/>
							</>
						)}
						{errors.State && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</label>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="w-full">
						<FloatingLabelInput register={register("City", { required: true })} />
						{errors.City && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</div>
					<div className="w-full">
						<FloatingLabelInput name="Postal Code" register={register("PostalCode", { required: true })} />
						{errors.PostalCode && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</div>
				</div>
			</div>
			<div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
			<h6 className="mb-3 font-semibold text-[#475569]">Additional Information</h6>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<label className="block">
					<span>Work Industry</span>
					<Controller
						name="WorkIndustry"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								maxMenuHeight={150}
								menuPosition="fixed"
								options={industryInfo.data?.Data}
								getOptionLabel={(option: any) => option.IndustryName}
								getOptionValue={(option: any) => option.ID}
								isLoading={industryInfo.isLoading}
								className="mt-1.5"
							/>
						)}
					/>
				</label>
				<label className="block">
					<span>Favorite CAD Application</span>
					<Controller
						name="FavCADApplication"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								maxMenuHeight={150}
								menuPosition="fixed"
								options={getCadApplicationList.data?.Data}
								getOptionLabel={(option: any) => option.Name}
								getOptionValue={(option: any) => option.ID}
								isLoading={getCadApplicationList.isLoading}
								className="mt-1.5"
							/>
						)}
					/>
				</label>
			</div>
		</UpdateProfileContent>
	);
}

export default BusinessProfile;
