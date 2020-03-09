import { h } from 'preact';
import { inline } from 'css:./styles.css';

function Footer() {
  return (
    <footer>
      {/* What's the right way to style this? */}
      <style>{inline}</style>
      <div className="container">
        <h2>
          Tooling.<span>Report</span>
        </h2>
        <p>
          Leverage agile frameworks to provide a robust synopsis for high level
          overviews. Iterative approaches to corporate strategy foster
          collaborative thinking to further the overall value proposition.
          Organically grow the holistic world view of disruptive innovation via
          workplace diversity and empowerment.
        </p>
        <hr />
        <ul>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Terms and Conditions</a>
          </li>
          <li>
            <a href="https://github.com/GoogleChromeLabs/tooling.report">
              Source on Github
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
