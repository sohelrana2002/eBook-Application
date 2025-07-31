"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { Mail, MapPin, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createContact } from "@/lib/api";
import { useAuthContext } from "@/context/authContext";
import { LoaderCircle } from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    const nameFromLocal = localStorage.getItem("name");

    if (nameFromLocal) {
      setForm((prev) => ({
        ...prev,
        name: nameFromLocal,
      }));
    }
  }, []);

  const mutation = useMutation({
    mutationFn: ({ email, message }) => createContact(email, message),
    onSuccess: (data) => {
      alert(data.message);

      setForm({
        email: "",
        message: "",
      });
    },
    onError: (error) => {
      alert(error?.response?.data?.message);
    },
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You must be logged in to submit a message");
      return;
    }

    mutation.mutate({
      email: form.email,
      message: form.message,
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us | e-Book Application</title>
        <meta name="description" content="Get in touch with the e-Book team." />
      </Head>

      <main className="max-w-7xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="heading mb-15">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              Have questions about our platform, your account, or suggestions
              for books? We&apos;d love to hear from you. Reach out through the
              form or use the contact details below.
            </p>

            <div className="flex items-center gap-4">
              <Mail className="text-black-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-gray-600">support@ebookapp.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-black-600" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-gray-600">+880 01751070854</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-black-600" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-sm text-gray-600">Rajshahi, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded capitalize"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 px-4 py-2 rounded"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-black text-white px-6 py-2 rounded cursor-pointer flex items-center gap-2 justify-center"
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Send Message
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
