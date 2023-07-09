import { UpdateProfileContent } from "../components";

function AccountSettings() {
	return (
		<UpdateProfileContent title="Account Settings">
			<section>
				<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
					Set the Default Learning Tab
				</h6>
				<p className="text-sm+ mt-0.5 mb-4">Some text related to the User Data</p>

				<div className="mt-5 space-x-4">
					<label className="inline-flex items-center space-x-2">
						<input
							className="form-checkbox is-basic h-5 w-5 rounded-full border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							type="checkbox"
						/>
						<p>Catalog</p>
					</label>

					<label className="inline-flex items-center space-x-2">
						<input
							className="form-checkbox is-basic h-5 w-5 rounded-full border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							type="checkbox"
						/>
						<p>Favorites</p>
					</label>

					<label className="inline-flex items-center space-x-2">
						<input
							className="form-checkbox is-basic h-5 w-5 rounded-full border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							type="checkbox"
						/>
						<p>Assigned learning</p>
					</label>

					<label className="inline-flex items-center space-x-2">
						<input
							className="form-checkbox is-basic h-5 w-5 rounded-full border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							type="checkbox"
						/>
						<p>Recommened</p>
					</label>
				</div>
			</section>
			<section>
				<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
				<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
					Control if My Catalog Can Be Seen
				</h6>
				<p className="text-sm+ mt-0.5 mb-4">Some text related to the my catalog</p>
				<div className="mt-5 space-x-4">
					<label className="inline-flex items-center space-x-2">
						<input
							name="catalog"
							className="form-checkbox is-basic h-5 w-5 rounded-full border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							type="radio"
						/>
						<p>Show catalog</p>
					</label>

					<label className="inline-flex items-center space-x-2">
						<input
							name="catalog"
							className="form-checkbox is-basic h-5 w-5 rounded-full border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							type="radio"
						/>
						<p>Hide catalog</p>
					</label>
				</div>
			</section>
			<section>
				<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
				<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
					Control What Categories Show in the My Catalog
				</h6>
				<p className="text-sm+ mt-0.5 mb-4">Some text related to the category management</p>

				<button className="btn h-10 rounded-full bg-primary/10 underline text-sm font-semibold text-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
					Manage category visibility
				</button>
			</section>

			<section>
				<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
				<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
					Controls Visibility of Account Logo
				</h6>
				<p className="text-sm+ mt-0.5 mb-4">
					Use this setting to control visibility of Account Logo on Silde Bar. If you upload a custom logo, it
					should be no more than 65px tall and 250px wide.
				</p>

				<div className="avatar h-24 w-24">
					<img className="mask is-squircle" src="/assets/images/account_logo.png" alt="avatar" />
				</div>
			</section>
			<section>
				<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
				<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
					Controls Visibility of Public Categories for Authoring
				</h6>
				<p className="text-sm+ mt-0.5 mb-4">
					Use this setting to control visibility of all i GET IT categories for authors.
				</p>
				<label className="inline-flex items-center space-x-2 select-none">
					<input
						className="form-checkbox is-basic h-4 w-4 rounded border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
						type="checkbox"
					/>
					<p>Hide all igetit authors</p>
				</label>
			</section>
		</UpdateProfileContent>
	);
}

export default AccountSettings;
