import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/http/api";

const DeleteUser = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: (data) => {
      alert(data.message);
      // console.log("Logged in user:", data);
      queryClient.invalidateQueries(["users"]);
      navigate("/users");
    },
    onError: (error) => {
      // console.log("error", error);

      alert(error?.response?.data?.message);
    },
  });

  const handleDelete = () => {
    mutation.mutate(id);
  };

  return (
    <div className="w-[calc(100vw-260px)] h-[80vh] flex flex-col items-center justify-center">
      <div className="w-xs flex flex-col gap-5 border rounded py-5 px-4">
        <h1 className="font-semibold text-xl">
          Are you sure want to delete the user?
        </h1>
        <div className="flex items-center justify-between">
          <button
            className="py-2 px-4  rounded bg-red-900 text-white cursor-pointer"
            onClick={() => navigate("/users")}
          >
            Cancle
          </button>
          <button
            className="py-2 px-4  rounded bg-black text-white cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
