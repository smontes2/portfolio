import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = ({ hero = {} }) => {
  const {
    title,
    description,
    contactText,
    contactHref,
    imageSrc,
    imageAlt,
  } = hero;

	return <section className={styles.container}>
		<div className={styles.content}>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.description}>
				{description}
			</p>
			<a href={contactHref} className={styles.contactBtn}>{contactText}</a>
		</div>
		<img src={getImageUrl(imageSrc)} alt={imageAlt} className={styles.heroImg}/>
		<div className={styles.topBlur}/>
		<div className={styles.bottomBlur}/>
	</section>;
};
