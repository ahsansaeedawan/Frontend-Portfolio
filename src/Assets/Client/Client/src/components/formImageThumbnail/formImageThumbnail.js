import React from "react";
import Spinner from "../../assets/images/spinner.gif";

class FormImageThumbnail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      thumb: undefined
    };

  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.file || this.props.file === nextProps.file) {
      return;
    }

    this.setState({ loading: true }, () => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file);
    });
  }

  componentDidMount() {
    if (this.props.file) {
      this.setState({
        thumb: this.props.file
      });
    }
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>loading...</p>;
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            className="preloader-img"
            src={thumb}
            alt={file.name}
            style={{
              width: "25px",
              height: "25px",
              backgroundImage: `url(${Spinner})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "15px",
              marginRight: "15px"
            }}
          />

          {file.name && (
            <p style={{ color: "#888888", fontSize: "18px" }}>{file.name}</p>
          )}
        </div>
        <i
          onClick={this.props.removeImage}
          title="Remove Image"
          className="sf-icon i-modal-close"
        />
      </div>
    );
  }
}

export default FormImageThumbnail;
