import { cn } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';

interface IModalProps {
	open?: boolean;
	onClose?: () => void;
	title?: string;
	children?: React.ReactNode;
	titleClassName?: string;
}

const Modal = (props: IModalProps) => {
	const { open, onClose, title, children, titleClassName } = props;

	const onClickClose = () => {
		if (onClose) onClose();
	};

	return (
		<Transition
			appear
			show={open}
			as={Fragment}
		>
			<Dialog
				as="div"
				className="relative z-30"
				onClose={onClickClose}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white px-6 py-8 my-5 text-left align-middle shadow-xl transition-all relative z-50">
								<div className="">
									{title && (
										<Dialog.Title
											as="h3"
											className={cn(
												'text-lg font-medium leading-6 text-gray-900',
												titleClassName
											)}
										>
											{title}
										</Dialog.Title>
									)}
									<div
										className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-slate-200 translate-all absolute top-2.5 right-2.5 cursor-pointer rounded-full"
										onClick={onClickClose}
									>
										<XMarkIcon className="w-5 h-5" />
									</div>
								</div>

								<div className="mt-5">{children}</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export { Modal };
