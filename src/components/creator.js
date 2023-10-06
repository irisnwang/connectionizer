import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createPuzzle } from "../services/puzzles-service";
import { BASE_URL } from "./utils";

export const Creator = () => {
  const form = useForm();

  const infiniteGuesses = form.watch("infinite");
  form.watch("guesses");

  const onSubmit = async (data) => {
    const created = await createPuzzle({
        guesses: data.guesses,
        words: [
          { word: data.cat1word1, category: data.category1, difficulty: 1 },
          { word: data.cat1word2, category: data.category1, difficulty: 1 },
          { word: data.cat1word3, category: data.category1, difficulty: 1 },
          { word: data.cat1word4, category: data.category1, difficulty: 1 },
          { word: data.cat2word1, category: data.category2, difficulty: 2 },
          { word: data.cat2word2, category: data.category2, difficulty: 2 },
          { word: data.cat2word3, category: data.category2, difficulty: 2 },
          { word: data.cat2word4, category: data.category2, difficulty: 2 },
          { word: data.cat3word1, category: data.category3, difficulty: 3 },
          { word: data.cat3word2, category: data.category3, difficulty: 3 },
          { word: data.cat3word3, category: data.category3, difficulty: 3 },
          { word: data.cat3word4, category: data.category3, difficulty: 3 },
          { word: data.cat4word1, category: data.category4, difficulty: 4 },
          { word: data.cat4word2, category: data.category4, difficulty: 4 },
          { word: data.cat4word3, category: data.category4, difficulty: 4 },
          { word: data.cat4word4, category: data.category4, difficulty: 4 },
        ],
      });
      window.location.replace(BASE_URL + "create/" + created._id);
    };

  function CategoryRow(number) {
    return (
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" gap={2}>
        <Box gridColumn="span 4">
          <Controller
            rules={{ required: true }}
            key={number}
            name={"category" + number}
            control={form.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                helperText={error ? error.message : null}
                size="small"
                fullWidth
                error={!!error}
                onChange={onChange}
                value={value}
                label={"Category " + number}
                variant="outlined"
              />
            )}
          />
        </Box>
        <>
          {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => {
            return (
              <Controller
                rules={{ required: true }}
                name={"cat" + number + "word" + n}
                key={number + " " + n}
                control={form.control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    key={number + " " + n}
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    variant="outlined"
                  />
                )}
              />
            );
          })}
        </>
      </Box>
    );
  }

  return (
    <Box
      display="grid"
      alignItems="center"
      justifyItems="center"
      justifyContent="space-between"
      gap={2}
      gridTemplateColumns="1fr"
    >
      {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => CategoryRow(n))}
      <Box display="grid" span="4">
        <Controller
          rules={{ required: true }}
          name={"guesses"}
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              helperText={error ? error.message : null}
              disabled={infiniteGuesses}
              type="number"
              size="small"
              error={!!error}
              value={field.value >= 0 ? field.value : ""}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              label={"Guesses"}
              variant="outlined"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
            />
          )}
        />
        <FormControlLabel
          control={
            <Controller
              name={"infinite"}
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value ?? false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      form.setValue("guesses", -1);
                    } else {
                      form.setValue("guesses", null);
                    }
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          }
          label="Infinite Guesses"
          labelPlacement="end"
        />
      </Box>
      <div />
      <Button onClick={form.handleSubmit(onSubmit)} color="secondary" variant="outlined">Submit</Button>
    </Box>
  );
};

export default Creator;
