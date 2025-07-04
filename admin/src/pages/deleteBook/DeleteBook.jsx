// currently not used this page

import { deleteBook } from "@/http/api";
import Loading from "@/shared/loading/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteBook = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (bookId) => deleteBook(bookId),
    onSuccess: () => {
      // console.log("Book created:", data);
      alert("Book deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/books");
    },
    onError: (error) => {
      const backendMessage =
        error?.response?.data?.message || "Something went wrong";
      alert(backendMessage);
    },
  });

  useEffect(() => {
    mutation.mutate(id);
  }, []);

  if (mutation.isPending) {
    return (
      <>
        <Loading />
      </>
    );
  }
};

export default DeleteBook;
