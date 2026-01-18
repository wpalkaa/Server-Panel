
import '../../LoginStyles.css';

export default function FormError( {error} ) {

    return (
        <div className="form-error">
            <i className="fa-solid fa-x"></i> {error}
        </div>
    )
}