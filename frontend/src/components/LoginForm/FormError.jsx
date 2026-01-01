
export default function FormError( {error} ) {

    return (
        <div className="form-error" style={{color: 'red', fontSize: '0.7rem'}}>
            <i className="fa-solid fa-x"></i> {error}
        </div>
    )
}