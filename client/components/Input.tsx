import classNames from 'classnames';

interface IProps{
  type:string;
  value:string;
  setValue: (str: string) => void;
  placeholder: string;
  error?: string | undefined;
}

const Input : React.FC<IProps> = ({type,value,setValue,placeholder,error}) => {
  return (
    <>
      <input type={type} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className={classNames("w-full px-3 py-2 transition duration-200 bg-gray-100 border border-gray-300 rounded hover:bg-white",{'border-red-500':error})}/>
      {error && (<small className="font-medium text-red-500">{error}</small>)}
    </>
  )
}

export default Input;