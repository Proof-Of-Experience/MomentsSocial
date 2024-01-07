import { cn } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';

interface IModalProps {
	open?: boolean;
	onClose?: () => void;
	title?: string;
	children?: React.ReactNode;
	className?: string;
	titleClassName?: string;
	bodyClassName?: string;
	width?:
		| 'xs'
		| 'sm'
		| 'md'
		| 'lg'
		| 'xl'
		| '2xl'
		| '3xl'
		| '4xl'
		| '5xl'
		| '6xl'
		| '7xl'
		| 'full';
}

const Modal = (props: IModalProps) => {
	const {
		open,
		onClose,
		title,
		children,
		className,
		titleClassName,
		bodyClassName,
		width = 'lg',
	} = props;

	const onClickClose = () => {
		if (onClose) onClose();
	};

	const WIDTH = {
		xs: 'max-w-xs',
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		'3xl': 'max-w-3xl',
		'4xl': 'max-w-4xl',
		'5xl': 'max-w-5xl',
		'6xl': 'max-w-6xl',
		'7xl': 'max-w-7xl',
		full: 'max-w-full',
	};

	return (
		<Transition
			appear
			show={open}
			as={Fragment}
		>
			<Dialog
				as="div"
				className={cn('relative z-30', className)}
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
							<Dialog.Panel
								className={cn(
									'w-full transform overflow-hidden rounded-2xl bg-white  my-5 text-left align-middle shadow-xl transition-all relative z-50',
									WIDTH[width]
								)}
							>
								<div className="px-6 pt-6">
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

								<div className={cn('px-6 pb-6', bodyClassName)}>{children}</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export { Modal };
