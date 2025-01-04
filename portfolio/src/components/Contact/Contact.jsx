import React from "react"

import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
	return <footer className={styles.container} id="contact">
		<div className={styles.text}>
			<h1 className={styles.title}>Contact</h1>
			<p className={styles.message}>Feel free to reach out!</p>
		</div>
		<div className={styles.contactInfo}>
			<ul className={styles.contactItems}>
				<li className={styles.contactItem}>
					<a href="mailto:smontes2022@gmail.com" target="_blank"><img src={getImageUrl("/contact/emailIcon.png")} alt="email icon" className={styles.linkImg} /></a>
					<div className={styles.contactItemText}>
						<a href="mailto:smontes2022@gmail.com" target="_blank" className={styles.link}>smontes2022@gmail.com</a>
					</div>					
				</li>
				<li className={styles.contactItem}>
					<a href="https://www.linkedin.com/in/samuel-montes-/" target="_blank"><img src={getImageUrl("/contact/linkedinIcon.png")} alt="linkedin icon" className={styles.linkImg}/></a>
					<div className={styles.contactItemText}>
						<a href="https://www.linkedin.com/in/samuel-montes-/" target="_blank" className={styles.link}>linkedlin.com/samuel-montes-</a>
					</div>
				</li>
				<li className={styles.contactItem}>
					<a href="https://github.com/smontes2" target="_blank"><img src={getImageUrl("/contact/githubIcon.png")} alt="github icon" className={styles.linkImg}/></a>
					<div className={styles.contactItemText}>
						<a href="https://github.com/smontes2" target="_blank" className={styles.link}>github.com/smontes2</a>
					</div>
				</li>
			</ul>
		</div>
	</footer>
}