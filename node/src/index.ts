export default class ArcadeReporter {
  private readonly _options: Record<string, unknown>;

  constructor(options: Record<string, unknown> = {}) {
    this._options = options;
  }

  onBegin() {
    return;
  }

  onTestBegin() {
    return;
  }

  onTestEnd() {
    return;
  }

  onStdOut() {
    return;
  }

  onStdErr() {
    return;
  }

  onEnd() {
    return;
  }
}
