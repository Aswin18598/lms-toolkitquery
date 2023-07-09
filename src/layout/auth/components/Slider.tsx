import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";

const dataSlider = [
	{
		id: 1,
		title: "Lorem 1 ipsum",
		subTitle: "Lorem"
	},
	{
		id: 2,
		title: "Lorem 2 ipsum",
		subTitle: "Lorem"
	},
	{
		id: 3,
		title: "Lorem 3 ipsum",
		subTitle: "Lorem"
	}
];

export function Slider() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [loaded, setLoaded] = useState(false);

	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
		{
			initial: 0,
			loop: true,
			slideChanged(slider) {
				setCurrentSlide(slider.track.details.rel);
			},
			created() {
				setLoaded(true);
			}
		},
		[
			slider => {
				let timeout: ReturnType<typeof setTimeout>;
				let mouseOver = false;
				function clearNextTimeout() {
					clearTimeout(timeout);
				}
				function nextTimeout() {
					clearTimeout(timeout);
					if (mouseOver) return;
					timeout = setTimeout(() => {
						slider.next();
					}, 3000);
				}
				slider.on("created", () => {
					slider.container.addEventListener("mouseover", () => {
						mouseOver = true;
						clearNextTimeout();
					});
					slider.container.addEventListener("mouseout", () => {
						mouseOver = false;
						nextTimeout();
					});
					nextTimeout();
				});
				slider.on("dragStarted", clearNextTimeout);
				slider.on("animationEnded", nextTimeout);
				slider.on("updated", nextTimeout);
			}
		]
	);
	return (
		<section className="hidden w-full place-items-center lg:grid bg-no-repeat bg-cover">
			<div className="fixed top-0 left-0 hidden p-6 lg:block lg:px-12">
				<a href="/" className="flex items-center space-x-2">
					<img alt="logo_w" className="mb-10" width={90} height={36} src="/logo.png" />
				</a>
			</div>
			<div className="w-full place-items-center max-w-lg lg:grid">
				<img className="w-auto" src="/assets/images/dashboard-check.svg" alt="d" />
				<div className="keen-slider my-8">
					{/* {dataSlider.map(slide => ( */}
					<div className="keen-slider__slide number-slide1 w-full flex flex-col items-center justify-center">
						<h1 className="leading-7 text-2xl font-semibold text-slate-600 dark:text-navy-100">
							Start learning now
						</h1>
						<p className="mt-3 text-center text-base">
							We provide an easy to use interface with adaptive content and clear direction. You'll find
							bitesize practical information from experts who are industry leaders in their field.
						</p>
					</div>
					{/* ))} */}
				</div>
				{/* {loaded && instanceRef.current && (
					<div className="flex space-x-2 items-center justify-center">
						{Array.from({ length: dataSlider.length }).map((item, idx) => (
							<button
								key={idx}
								onClick={() => {
									instanceRef.current?.moveToIdx(idx);
								}}
								className={`${
									currentSlide === idx
										? "w-6 bg-primary cursor-none"
										: "cursor-pointer w-2 bg-primary/60"
								} h-2 inline-block rounded-full ease-in-out duration-300`}
							/>
						))}
					</div>
				)} */}
			</div>
		</section>
	);
}
