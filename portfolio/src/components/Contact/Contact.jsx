import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

const isExternalLink = (url = "") =>
  /^https?:\/\//i.test(url);

export const Contact = ({ contact = {} }) => {
  const { title, message, methods = [] } = contact;

	return <footer className={styles.container} id="contact">
		<div className={styles.text}>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.message}>{message}</p>
		</div>
		<div className={styles.contactInfo}>
			<ul className={styles.contactItems}>
        {methods.map((method, index) => {
          const externalLink = isExternalLink(method.href);

          return (
            <li className={styles.contactItem} key={`contact-method-${index}`}>
              <a
                href={method.href}
                target={externalLink ? "_blank" : undefined}
                rel={externalLink ? "noreferrer" : undefined}
              >
                <img
                  src={getImageUrl(method.imageSrc)}
                  alt={method.imageAlt}
                  className={styles.linkImg}
                />
              </a>
              <div className={styles.contactItemText}>
                <a
                  href={method.href}
                  target={externalLink ? "_blank" : undefined}
                  rel={externalLink ? "noreferrer" : undefined}
                  className={styles.link}
                >
                  {method.label}
                </a>
              </div>
            </li>
          );
        })}
			</ul>
		</div>
	</footer>
};
