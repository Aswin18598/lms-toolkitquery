import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { navigateLink } from "~/config/api/links";
import { useGetProfileDataQuery } from "~/features/dashboard/store";
import { getLoggedUser } from "~/helpers/auth";
import { UpdateProfileContent } from "../components";
import { PageName, UserUpdateProfileApi } from "../store";

function PersonalProfile() {
	const { isLoading, data } = UserUpdateProfileApi.useGetProfileQuery(PageName.PersonalProfile);
	const navigate = useNavigate();
	const [updateProfile, option] = UserUpdateProfileApi.useUpdateProfileMutation();
	const { UserId } = getLoggedUser();
	const { refetch } = useGetProfileDataQuery(UserId);
	const { register, handleSubmit, reset, formState } = useForm();
	const { errors } = formState;
	const onSubmit = (body: any) => {
		updateProfile({ pageName: PageName.PersonalProfile, body });
		setTimeout(() => {
			refetch();
		}, 500);
	};

	useEffect(() => {
		if (data?.Data) {
			reset(data?.Data);
		}
	}, [data]);

	const onCancel = () => {
		reset(data?.Data);
		navigate(navigateLink.dashboard);
	};

	return (
		<UpdateProfileContent
			onSave={handleSubmit(onSubmit)}
			onCancel={onCancel}
			title="Personal Profile"
			isLoading={isLoading || option.isLoading}
		>
			<h6 className="mb-3 font-semibold text-[#475569]">Basic Details</h6>
			<div className="mt-4 space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<FloatingLabelInput register={register("FirstName", { required: true })} />
						{errors.FirstName && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</div>
					<div>
						<FloatingLabelInput register={register("LastName", { required: true })} />
						{errors.LastName && <span className="text-red-500 text-xs ml-2">This field is required</span>}
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FloatingLabelInput register={register("UserName")} disabled />
					<FloatingLabelInput register={register("Email")} />
				</div>
				<label className="block">
					<span className="text-sm">Bio</span>
					<textarea
						rows={4}
						placeholder="Bio Description"
						className="form-textarea dark:focus:border-accent mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400"
						{...register("Biography")}
					></textarea>
				</label>
			</div>
			<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
			<h6 className="font-semibold text-[#475569]">Social Profiles</h6>
			<p className="mt-0.5 mb-4 text-sm">These links will be shown in your public profile</p>
			<div className="mt-4 space-y-4">
				<label className="flex">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-[#0e76a8] p-1 dark:border-navy-450">
						<Icon width={22} icon="akar-icons:linkedin-box-fill" color="#fff" />
					</span>
					<input
						className="form-input dark:focus:border-accent w-full rounded-r-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400"
						placeholder="Linked In"
						type="text"
						{...register("SocialLinkedIn")}
					/>
				</label>

				<label className="flex">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-white p-1 dark:border-navy-450">
						<Icon width={22} icon="flat-color-icons:google" />
					</span>
					<input
						className="form-input dark:focus:border-accent w-full rounded-r-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400"
						placeholder="Gmail"
						type="text"
						{...register("SocialGmail")}
					/>
				</label>

				<label className="flex">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-[#3b5998] p-1 dark:border-navy-450">
						<Icon width={22} icon="akar-icons:facebook-fill" color="#fff" />
					</span>
					<input
						className="form-input dark:focus:border-accent w-full rounded-r-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400"
						placeholder="Facebook"
						type="text"
						{...register("SocialFacebook")}
					/>
				</label>
			</div>
		</UpdateProfileContent>
	);
}
export default PersonalProfile;
