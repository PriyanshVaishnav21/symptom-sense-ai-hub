
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    navigate("/");
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-health-light px-4 py-12">
      <div className="max-w-md w-full">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default Login;
