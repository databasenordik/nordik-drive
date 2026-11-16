import reducer, {
  addPendingExchange,
  configureComparison,
  resolveExchange,
  selectNiaThreadByFileName,
  setComparisonEngine,
} from "./niaChatSlice";

test("comparison keeps engine histories separate and refuses switching while pending", () => {
  let state = reducer(
    undefined,
    configureComparison({ enabled: true, expires_at: "2099-01-01T00:00:00Z" }),
  );
  state = reducer(state, setComparisonEngine("api"));
  state = reducer(
    state,
    addPendingExchange({
      id: "q",
      fileName: "Students.csv",
      question: "Count?",
      askedAt: "now",
      selectedCommunitiesSnapshot: [],
      engine: "api",
    }),
  );
  state = reducer(state, setComparisonEngine("nia"));
  expect(state.comparisonEngine).toBe("api");
  state = reducer(
    state,
    resolveExchange({
      fileName: "Students.csv",
      engine: "api",
      exchangeId: "q",
      answer: "3",
      answeredAt: "now",
    }),
  );
  state = reducer(state, setComparisonEngine("nia"));
  expect(
    selectNiaThreadByFileName({ niaChat: state }, "Students.csv"),
  ).toBeNull();
  state = reducer(state, setComparisonEngine("api"));
  expect(
    selectNiaThreadByFileName({ niaChat: state }, "Students.csv")?.exchanges[0]
      .answer,
  ).toBe("3");
  state = reducer(state, configureComparison({ enabled: false }));
  expect(state.comparisonEngine).toBeUndefined();
});

test("an expired comparison cannot select another engine", () => {
  let state = reducer(
    undefined,
    configureComparison({ enabled: true, expires_at: "2020-01-01T00:00:00Z" }),
  );
  state = reducer(state, setComparisonEngine("api"));
  expect(state.comparisonEngine).toBeUndefined();
});
