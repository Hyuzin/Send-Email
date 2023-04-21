import { Montserrat } from "next/font/google";
import { BiArrowBack } from "react-icons/bi";
import {
  Button,
  ChakraProvider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { sendContactForm } from "../lib/api";
import Link from "next/link";
import { useRouter } from "next/router";

const initValues = { name: "", email: "", subject: "", message: "" };

const initState = { isLoading: false, error: "", values: initValues };

const montserrat = Montserrat({ subsets: ["latin"] });

const Home = () => {
  const toast = useToast();
  const [state, setState] = useState(initState);
  const [touched, setTouched] = useState({});

  const { values, isLoading, error } = state;

  const onBlur = ({ target }) =>
    setTouched((prev) => ({ ...prev, [target.name]: true }));

  const handleChange = ({ target }) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  const onSubmit = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      await sendContactForm(values);
      setTouched({});
      setState(initState);
      toast({
        title: "Pesan terkirim.",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  const router = useRouter();
  return (
    <ChakraProvider>
      <div
        className={`${montserrat.className} bg-gray-300 flex justify-center items-center  md:px-[12%] lg:px-[25%] w-screen h-screen`}
      >
        <div className="flex flex-col w-full gap-5 py-[50%] md:py-10 px-5 bg-white rounded-xl ">
          <div className="flex flex-row items-center">
            <Button
              variant='outline'
              className="cursor-pointer"
              marginRight={10}
              type="button"
              borderColor='red.500'
              color='red.500'
              _hover={{ bgColor: 'red.500', color: 'white' }}
              onClick={() => router.back()}
            >
              <BiArrowBack />
            </Button>
            <p className="font-semibold text-center text-red-500">
              KIRIM PESAN
            </p>
          </div>
          {error && (
            <Text color="red.500" fontSize="md">
              {error}
            </Text>
          )}
          <FormControl isRequired isInvalid={touched.name && !values.name}>
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              name="name"
              errorBorderColor="red.500"
              value={values.name}
              onChange={handleChange}
              focusBorderColor="black"
              onBlur={onBlur}
            />
            <FormErrorMessage>Input wajib diisi.</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={touched.email && !values.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
              focusBorderColor="black"
              errorBorderColor="red.500"
              onBlur={onBlur}
            />
            <FormErrorMessage>Input wajib diisi.</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={touched.subject && !values.subject}
          >
            <FormLabel>Subjek</FormLabel>
            <Input
              type="text"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              focusBorderColor="black"
              errorBorderColor="red.500"
              onBlur={onBlur}
            />
            <FormErrorMessage>Input wajib diisi.</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={touched.message && !values.message}
          >
            <FormLabel>Pesan</FormLabel>
            <Textarea
              name="message"
              value={values.message}
              onChange={handleChange}
              rows={3}
              onBlur={onBlur}
              focusBorderColor="black"
              errorBorderColor="red.500"
            />
            <FormErrorMessage>Input wajib diisi.</FormErrorMessage>
          </FormControl>
          <Button
            variant="outline"
            isLoading={isLoading}
            bgColor="red.500"
            color="white"
            disabled={
              !values.name ||
              !values.email ||
              !values.subject ||
              !values.message
            }
            _hover={{ bgColor: "white", color: "red.500" }}
            _active={{ bgColor: "red.700", color: "white" }}
            onClick={onSubmit}
          >
            Kirim
          </Button>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default Home;
