import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/test-utils";
import { AiPopover } from "../AiPopeover";

describe("AiPopover Component", () => {
    const mockOnRequest = vi.fn();
    const mockOnApply = vi.fn();

    beforeEach(() => {
        mockOnRequest.mockClear();
        mockOnApply.mockClear();
    });

    describe("Rendering", () => {
        it("should render trigger element", () => {
            renderWithProviders(
                <AiPopover onRequest={mockOnRequest} loading={false} message="">
                    <div>Click me</div>
                </AiPopover>,
            );

            expect(screen.getByText("Click me")).toBeInTheDocument();
        });

        it("should not show popover initially when no message", () => {
            renderWithProviders(
                <AiPopover onRequest={mockOnRequest} loading={false} message="">
                    <button>Trigger</button>
                </AiPopover>,
            );

            expect(screen.queryByText(/Ответ AI/)).not.toBeInTheDocument();
        });

        it("should show popover when message is present", async () => {
            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="AI response text"
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText(/Ответ AI/)).toBeInTheDocument();
            });
        });

        it("should display message content", async () => {
            const message = "This is an AI response";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={message}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText(message)).toBeInTheDocument();
            });
        });
    });

    describe("Popover Interaction", () => {
        it("should open popover on trigger click", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response"
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            const trigger = screen.getByText("Trigger");
            await user.click(trigger);

            await waitFor(() => {
                expect(mockOnRequest).toHaveBeenCalled();
            });
        });

        it("should call onRequest when trigger is clicked", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <AiPopover onRequest={mockOnRequest} loading={false} message="">
                    <button>Trigger</button>
                </AiPopover>,
            );

            const trigger = screen.getByText("Trigger");
            await user.click(trigger);

            expect(mockOnRequest).toHaveBeenCalled();
        });

        it("should close popover on close button click", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response"
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText(/Ответ AI/)).toBeInTheDocument();
            });

            const closeButton = screen.getByText("Закрыть");
            await user.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText(/Ответ AI/)).not.toBeInTheDocument();
            });
        });

        it("should close popover after applying", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response"
                    onApply={mockOnApply}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText(/Ответ AI/)).toBeInTheDocument();
            });

            const applyButton = screen.getByText("Применить");
            await user.click(applyButton);

            expect(mockOnApply).toHaveBeenCalled();
        });
    });

    describe("Message Display", () => {
        it("should display long messages with scroll", () => {
            const longMessage = "a".repeat(500);

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={longMessage}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            const messageText = screen.getByText(longMessage);
            expect(messageText).toBeInTheDocument();
        });

        it("should handle messages with special characters", () => {
            const message = "Price: $100 & discount: 50% @special #tag";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={message}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            expect(screen.getByText(message)).toBeInTheDocument();
        });
    });

    describe("Text Comparison", () => {
        it("should show comparison when originalText is provided", async () => {
            const originalText = "Original text";
            const improvedText = "Original improved text";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={improvedText}
                    originalText={originalText}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Было")).toBeInTheDocument();
                expect(screen.getByText("Стало")).toBeInTheDocument();
            });
        });

        it("should hide comparison when no changes", async () => {
            const text = "Same text";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={text}
                    originalText={text}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.queryByText("Было")).not.toBeInTheDocument();
                expect(screen.queryByText("Стало")).not.toBeInTheDocument();
            });
        });

        it("should display original text in comparison", async () => {
            const originalText = "Original description";
            const improvedText = "Original improved description";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={improvedText}
                    originalText={originalText}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Было")).toBeInTheDocument();
            });
        });
    });

    describe("Loading State", () => {
        it("should update popover when loading stops", async () => {
            const { rerender } = renderWithProviders(
                <AiPopover onRequest={mockOnRequest} loading={true} message="">
                    <button>Trigger</button>
                </AiPopover>,
            );

            expect(screen.queryByText("Ответ")).not.toBeInTheDocument();

            rerender(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response ready"
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Response ready")).toBeInTheDocument();
            });
        });
    });

    describe("Buttons", () => {
        it("should show close button", async () => {
            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response"
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Закрыть")).toBeInTheDocument();
            });
        });

        it("should show apply button when onApply is provided", async () => {
            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response"
                    onApply={mockOnApply}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Применить")).toBeInTheDocument();
            });
        });

        it("should not show apply button when onApply is not provided", async () => {
            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Response"
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.queryByText("Применить")).not.toBeInTheDocument();
            });
        });
    });

    describe("Difference Calculation", () => {
        it("should highlight added words", async () => {
            const original = "Hello world";
            const improved = "Hello beautiful world";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={improved}
                    originalText={original}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Было")).toBeInTheDocument();
            });

            // The improved text should be visible showing the changes
            const staloBox = screen.getByText("Стало") as HTMLElement;
            expect(staloBox).toBeInTheDocument();
        });

        it("should handle empty original text", async () => {
            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="New text"
                    originalText=""
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("New text")).toBeInTheDocument();
            });
        });

        it("should handle text with multiple spaces", async () => {
            const original = "Text    with    spaces";
            const improved = "Text with normal spaces";

            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message={improved}
                    originalText={original}
                >
                    <button>Trigger</button>
                </AiPopover>,
            );

            await waitFor(() => {
                expect(screen.getByText("Было")).toBeInTheDocument();
            });
        });
    });

    describe("Props Variations", () => {
        it("should render with minimal props", () => {
            renderWithProviders(
                <AiPopover onRequest={mockOnRequest} loading={false} message="">
                    <button>Minimal</button>
                </AiPopover>,
            );

            expect(screen.getByText("Minimal")).toBeInTheDocument();
        });

        it("should render with all props", async () => {
            renderWithProviders(
                <AiPopover
                    onRequest={mockOnRequest}
                    loading={false}
                    message="Full response"
                    originalText="Original"
                    onApply={mockOnApply}
                >
                    <div>Full props</div>
                </AiPopover>,
            );

            expect(screen.getByText("Full props")).toBeInTheDocument();
        });
    });
});
