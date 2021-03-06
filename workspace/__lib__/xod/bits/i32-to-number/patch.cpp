node {
    void evaluate(Context ctx) {
      int32_t b3 = getValue<input_B3>(ctx);
      int32_t b2 = getValue<input_B2>(ctx);
      int32_t b1 = getValue<input_B1>(ctx);
      int32_t b0 = getValue<input_B0>(ctx);
      int32_t num = ((b3 << 24) | (b2 << 16) | (b1 << 8) | b0);
      Number result = (Number)num;
      emitValue<output_OUT>(ctx, result);
    }
}
