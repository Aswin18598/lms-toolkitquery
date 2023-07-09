import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Modal } from "~/components";
import { useAppSelector } from "~/config/store";
import { useCountryListQuery, useShippingAddressQuery, useUpdateAddressMutation } from "../store";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { UserUpdateProfileApi } from "~/features/account/update-profile/store";

export const MailingAddress = React.memo(() => {
	const { isLoading, refetch } = useShippingAddressQuery();
	const { shippingDetails } = useAppSelector((state: any) => state.cartReducer);
	const country = useCountryListQuery();
	const [updateAddress, option] = useUpdateAddressMutation();
	const [isEditAddress, setEditAddress] = React.useState<boolean>(false);
	const [getStateList, getStateListOption] = UserUpdateProfileApi.useGetCountryStateListMutation();

	const { register, handleSubmit, control, reset, setValue, formState } = useForm({
		mode: "onChange"
	});

	const { errors } = formState;

	const onSubmit = async (formData: any) => {
		await updateAddress(formData).unwrap();
		refetch();
		setEditAddress(false);
	};

	useEffect(() => {
		const Country = country.data?.Data.find((con: any) => shippingDetails.Country === con.CountryCode);
		let State = shippingDetails.State;

		if (Country?.id) {
			getStateList({ regionId: Country.id })
				.unwrap()
				.then((resp: any) => {
					if (resp?.Data?.length) {
						State = resp?.Data.find((st: any) => shippingDetails.State === st.Name);
					}
					reset({
						...shippingDetails,
						Country,
						State
					});
				});
		}
		// eslint-disable-next-line
	}, [shippingDetails, country.data]);

	return (
		<React.Fragment>
			<div className="card p-4 sm:px-5">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
						Address
					</h2>
					<button
						onClick={() => setEditAddress(true)}
						className="btn relative h-8 w-8 rounded-md p-0 hover:bg-slate-300/20"
						title="Update"
					>
						<Icon className="w-4 h-4 text-primary" icon="mingcute:pencil-line" />
					</button>
				</div>
				{isLoading && (
					<div className="pt-2 space-y-2">
						<div className="skeleton animate-wave h-4 w-6/12 rounded bg-slate-150 dark:bg-navy-500" />
						<div className="skeleton animate-wave h-4 w-full rounded bg-slate-150 dark:bg-navy-500" />
					</div>
				)}
				{!isLoading && (
					<div className="pt-2 text-base">
						<p>{shippingDetails?.name}</p>
						<p>{shippingDetails?.Email}</p>
						{shippingDetails.address !== ",,,, " && (
							<address className="mt-5">{shippingDetails?.address}</address>
						)}
					</div>
				)}
			</div>
			{isEditAddress && (
				<Modal className="max-w-xl" title="Update Address" onCancel={() => setEditAddress(false)}>
					<section className="flex flex-col gap-4 p-4">
						<div className="space-y-3">
							<label className="block">
								<span className="text-sm">Address line 1</span>
								<textarea
									defaultValue={shippingDetails?.Address1}
									placeholder="Address"
									className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
									{...register("Address1", { required: true })}
								/>
								{errors.Address1 && (
									<span className="text-red-500 text-xs ml-2">This field is required</span>
								)}
							</label>
							<label className="block">
								<span className="text-sm">Address line 2</span>
								<textarea
									defaultValue={shippingDetails?.Address2}
									placeholder="Address"
									className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
									{...register("Address2", { required: true })}
								/>
								{errors.Address2 && (
									<span className="text-red-500 text-xs ml-2">This field is required</span>
								)}
							</label>
							<div className="flex space-x-3">
								<label className="block w-1/2">
									<span className="text-sm">Country</span>
									<Controller
										name="Country"
										control={control}
										rules={{ required: true }}
										render={({ field: { onChange, ...restField } }) => (
											<Select
												{...restField}
												maxMenuHeight={150}
												menuPosition="fixed"
												options={country.data?.Data}
												getOptionLabel={(option: any) => option.CountryName}
												getOptionValue={(option: any) => option.id}
												isLoading={country.isLoading}
												className="mt-1.5"
												onChange={option => {
													onChange(option);
													setValue("State", "");
													getStateList({ regionId: option.id });
												}}
											/>
										)}
									/>
									{errors.Country && (
										<span className="text-red-500 text-xs ml-2">This field is required</span>
									)}
								</label>
								<label className="block w-1/2">
									<span className="text-sm">State</span>
									{getStateListOption.data?.Data.length === 0 && (
										<input
											defaultValue={shippingDetails.State}
											className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
											placeholder="State"
											type="text"
											{...register("State", { required: true })}
										/>
									)}
									{(getStateListOption.isLoading || getStateListOption.data?.Data.length !== 0) && (
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
									)}
									{errors.State && (
										<span className="text-red-500 text-xs ml-2">This field is required</span>
									)}
								</label>
							</div>
							<div className="flex space-x-3">
								<label className="block w-1/2">
									<span className="text-sm">City</span>
									<input
										defaultValue={shippingDetails.City}
										className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
										placeholder="City"
										type="text"
										{...register("City", { required: true })}
									/>
									{errors.City && (
										<span className="text-red-500 text-xs ml-2">This field is required</span>
									)}
								</label>
								<label className="block w-1/2">
									<span className="text-sm">Zip Code</span>
									<input
										defaultValue={shippingDetails.PostalCode}
										className="appearance-none form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
										placeholder="Zip Code"
										type="number"
										{...register("PostalCode", { required: true })}
									/>
									{errors.PostalCode && (
										<span className="text-red-500 text-xs ml-2">This field is required</span>
									)}
								</label>
							</div>
						</div>
						<div className="mt-6 text-right space-x-2">
							<button
								disabled={option.isLoading}
								onClick={() => setEditAddress(false)}
								className="btn h-8 rounded-full text-xs+ font-medium text-slate-700 hover:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:active:bg-navy-300/25"
							>
								Cancel
							</button>
							<button
								disabled={option.isLoading}
								onClick={handleSubmit(onSubmit)}
								className="btn h-8 rounded-full bg-primary text-xs+ font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
							>
								Update
							</button>
						</div>
					</section>
				</Modal>
			)}
		</React.Fragment>
	);
});
