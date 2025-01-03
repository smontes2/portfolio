import React from "react";

import styles from "./About.module.css";
import { getImageUrl } from "../../utils";

export const About = () => {
	return <section className={styles.container} id="about">
		<h2 className={styles.title}>About</h2>
		<div className={styles.content}>
			<img src={getImageUrl("about/aboutImage.png")} alt="about me image" className={styles.aboutImg}/>
			<ul className={styles.aboutItems}>
				<li className={styles.aboutItem}>
					<img src={getImageUrl("about/cursorIcon.png")} alt="cursor image"/>
					<div className={styles.aboutItemText}>
						<h3>Frontend Developer</h3>
						<p>I'm proficient in building responsive user interfaces using JavaScript and React, focusing on the usability and functionality of applications.</p>
					</div>
				</li>
				<li className={styles.aboutItem}>
					<img src={getImageUrl("about/serverIcon.png")} alt="server image"/>
					<div className={styles.aboutItemText}>
						<h3>Backend Developer</h3>
						<p>I am experienced in implementing robust backend solutions, utilizing version control tools like Git and GitHub</p>
					</div>
				</li>
				<li className={styles.aboutItem}>
					<img src={getImageUrl("about/uiIcon.png")} alt="UI image"/>
					<div className={styles.aboutItemText}>
						<h3>UI Designer</h3>
						<p>I'm skilled in crafting intuitive and visually appealing designs, prioritizing user-centered experiences for applications that simplify complex interactions</p>
					</div>
				</li>
			</ul>
		</div>
	</section>
}