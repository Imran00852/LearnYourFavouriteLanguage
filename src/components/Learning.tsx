import Loader from "./Loader";
import { ArrowBack, VolumeUp } from "@mui/icons-material";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAudio, translateWords } from "../utils/feature";
import { useDispatch, useSelector } from "react-redux";
import {
  clearState,
  getWordsFail,
  getWordsRequest,
  getWordsSuccess,
} from "../redux/slices";

const Learning = () => {
  const [count, setCount] = useState<number>(0);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const audioRef = useRef(null);
  const params = useSearchParams()[0].get("language") as LangType;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, words } = useSelector(
    (state: { root: StateType }) => state.root
  );

  const audioHandler = async () => {
    const player: HTMLAudioElement = audioRef.current!;
    if (player) {
      player.play();
    } else {
      const data = await fetchAudio(words[count]?.word, params);

      setAudioSrc(data);
    }
  };

  const nextHandler = (): void => {
    setCount((prev) => prev + 1);
    setAudioSrc("");
  };
  useEffect(() => {
    dispatch(getWordsRequest());
    translateWords(params)
      .then((arr) => dispatch(getWordsSuccess(arr)))
      .catch((err) => dispatch(getWordsFail(err)));

    if (error) {
      alert(error);
      dispatch(clearState());
    }
  }, []);

  if (loading) return <Loader />;

  return (
    <Container
      maxWidth={"sm"}
      sx={{
        padding: "1rem",
      }}
    >
      {audioSrc && <audio src={audioSrc} autoPlay ref={audioRef}></audio>}
      <Button
        onClick={
          count === 0 ? () => navigate("/") : () => setCount((prev) => prev - 1)
        }
      >
        <ArrowBack />
      </Button>
      <Typography m={"2rem 0"}>Learning Made Easy</Typography>
      <Stack direction={"row"} spacing={"1rem"}>
        <Typography variant={"h4"}>
          {count + 1}-{words[count]?.word}
        </Typography>
        <Typography color={"blue"} variant="h4">
          :{words[count]?.meaning}
        </Typography>
        <Button onClick={audioHandler} sx={{ borderRadius: "50%" }}>
          <VolumeUp />
        </Button>
      </Stack>
      <Button
        sx={{
          margin: "3rem 0",
        }}
        variant="contained"
        fullWidth
        onClick={count === 7 ? () => navigate("/quiz") : nextHandler}
      >
        {count === 7 ? "Test" : "Next"}
      </Button>
    </Container>
  );
};

export default Learning;
