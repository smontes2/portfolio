import React from "react";

import styles from "./About.module.css";
import { getImageUrl } from "../../utils";

const cards = [
	{
		icon: "about/cursorIcon.png",
		alt: "cursor icon",
		label: "Frontend",
		title: "Frontend Developer",
		description:
			"Proficient in building responsive user interfaces using JavaScript and React, focusing on usability and functionality.",
	},
	{
		icon: "about/serverIcon.png",
		alt: "server icon",
		label: "Backend",
		title: "Backend Developer",
		description:
			"Experienced in implementing robust backend solutions and utilizing version control tools like Git and GitHub.",
	},
	{
		icon: "about/uiIcon.png",
		alt: "UI icon",
		label: "Design",
		title: "UI Designer",
		description:
			"Skilled in crafting intuitive, visually appealing designs that prioritize user-centered experiences.",
	},
];

export const About = () => {
	return (
		<section className={styles.container} id="about">
			<h2 className={styles.title}>About</h2>
			<div className={styles.content}>
				<ul className={styles.cards}>
					{cards.map((card, i) => (
						<li key={i} className={styles.card}>
							<div className={styles.cardTop}>
								<div className={styles.iconWrap}>
									<img src={getImageUrl(card.icon)} alt={card.alt} />
								</div>
								<span className={styles.label}>{card.label}</span>
							</div>
							<h3 className={styles.cardTitle}>{card.title}</h3>
							<p className={styles.cardDesc}>{card.description}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};
